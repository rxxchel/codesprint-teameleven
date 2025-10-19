"use client";

import { useEffect, useRef } from "react";

export type PortDatum = {
  name: string;
  lat: number;
  lng: number;
  kpi: number;
  metrics: {
    arrival_accuracy_delta_week: number;
    assured_port_time_pct: number;
    berth_time_variance_h: number;
    throughput_teu_day: number;
  };
};

type GlobeInstance = {
  pointsData: (data: PortDatum[]) => GlobeInstance;
  labelsData: (data: PortDatum[]) => GlobeInstance;
  globeImageUrl: (url: string) => GlobeInstance;
  pointLat: (accessor: (point: PortDatum) => number) => GlobeInstance;
  pointLng: (accessor: (point: PortDatum) => number) => GlobeInstance;
  pointAltitude: (accessor: (point: PortDatum) => number) => GlobeInstance;
  pointColor: (accessor: (point: PortDatum) => string) => GlobeInstance;
  pointRadius: (accessor: (point: PortDatum) => number) => GlobeInstance;
  labelText: (accessor: (point: PortDatum) => string) => GlobeInstance;
  labelAltitude: (accessor: (point: PortDatum) => number) => GlobeInstance;
  width?: (value: number) => GlobeInstance;
  height?: (value: number) => GlobeInstance;
  resetProps?: () => GlobeInstance;
  _destructor?: () => void;
  pointLabel?: (accessor: (point: PortDatum) => string) => GlobeInstance;
  onClick?: (
    handler: (obj: { type: string; data: unknown }) => void,
  ) => GlobeInstance;
  onHover?: (
    handler: (
      obj: { type: string; data: unknown } | null,
      prevObj: { type: string; data: unknown } | null,
    ) => void,
  ) => GlobeInstance;
};

type GlobeARConstructor = new (
  element: HTMLElement,
  config?: { markerAttrs?: Record<string, unknown> },
) => GlobeInstance;

type RuntimeWindow = Window & {
  AFRAME?: { THREE?: unknown };
  THREE?: unknown;
};

export type ARGlobeProps = {
  data: PortDatum[];
  selected?: string;
  onSelect?: (port: PortDatum) => void;
  onReady?: () => void;
};

const EARTH_TEXTURE =
  "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";

export function ARGlobe({ data, selected, onSelect, onReady }: ARGlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const selectHandlerRef = useRef<ARGlobeProps["onSelect"]>(onSelect);
  const readyHandlerRef = useRef<ARGlobeProps["onReady"]>(onReady);
  const dataRef = useRef<PortDatum[]>(data);

  useEffect(() => {
    selectHandlerRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    readyHandlerRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (!containerRef.current || globeRef.current) return;

    let isCancelled = false;

    async function loadGlobe() {
      try {
        const win = window as RuntimeWindow;

        if (!win.AFRAME) {
          console.error("[AR] A-Frame runtime not available on window");
          return;
        }

        if (!win.THREE && win.AFRAME.THREE) {
          win.THREE = win.AFRAME.THREE;
        }

        const { default: GlobeARModule } = (await import("globe-ar")) as {
          default: GlobeARConstructor | undefined;
        };

        if (!GlobeARModule) {
          console.error("[AR] globe-ar module did not provide a constructor");
          return;
        }

        if (!containerRef.current || isCancelled) {
          return;
        }

        const globe = new GlobeARModule(containerRef.current, {
          markerAttrs: { preset: "hiro" },
        });

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        globe.resetProps?.();
        if (width) {
          globe.width?.(width);
        }
        if (height) {
          globe.height?.(height);
        }

        globe
          .globeImageUrl(EARTH_TEXTURE)
          .pointLat((point) => point.lat)
          .pointLng((point) => point.lng)
          .pointAltitude((point) => getAltitude(point, selected))
          .pointColor((point) => getPointColor(point))
          .pointRadius((point) => getRadius(point, selected))
          .labelsData(data)
          .labelText((point) => point.name)
          .labelAltitude(() => 0.025);

        if (globe.pointLabel) {
          globe.pointLabel((point) => formatTooltip(point));
        }

        if (globe.onClick) {
          globe.onClick((obj) => {
            if (!obj || obj.type !== "point" || !obj.data) return;
            const payload = obj.data as PortDatum;
            selectHandlerRef.current?.(payload);
          });
        }

        if (globe.onHover) {
          globe.onHover((obj, prev) => {
            if (obj?.type === "point") {
              document.body.style.cursor = "pointer";
            } else if (prev?.type === "point") {
              document.body.style.cursor = "auto";
            }
          });
        }

        styleScene(containerRef.current);

        globe.pointsData(dataRef.current);
        globeRef.current = globe;
        readyHandlerRef.current?.();
      } catch (error) {
        console.error("[AR] Failed to load globe-ar", error);
      }
    }

    loadGlobe();

    return () => {
      isCancelled = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
      if (globeRef.current?._destructor) {
        globeRef.current._destructor();
      }
      globeRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      document.body.style.cursor = "auto";
    };
  }, []);

  useEffect(() => {
    if (!globeRef.current || !containerRef.current) return;

    const globe = globeRef.current;
    const host = containerRef.current;

    if (typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const resize = (width: number, height: number) => {
      if (width > 0) {
        globe.width?.(width);
      }
      if (height > 0) {
        globe.height?.(height);
      }
    };

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        resize(width, height);
      }
    });

    observer.observe(host);

    cleanupRef.current = () => {
      observer.disconnect();
    };

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.pointsData(data).labelsData(data);
  }, [data]);

  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current
      .pointRadius((point) => getRadius(point, selected))
      .pointAltitude((point) => getAltitude(point, selected))
      .pointColor((point) => getPointColor(point));
  }, [selected]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-transparent"
    />
  );
}

function getRadius(point: PortDatum, selected?: string) {
  const base = 0.18;
  if (selected && point.name === selected) {
    return base * 1.4;
  }
  return base;
}

function getAltitude(point: PortDatum, selected?: string) {
  const base = 0.06;
  const adjustment = selected && point.name === selected ? 0.035 : 0;
  return base + adjustment;
}

function getPointColor(point: PortDatum) {
  const { kpi } = point;
  if (kpi >= 0.05) return "#22c55e";
  if (kpi <= -0.05) return "#f43f5e";
  return "#d4d4d8";
}

function formatTooltip(point: PortDatum) {
  const { metrics } = point;
  const lines = [
    `${point.name}`,
    `KPI Δ: ${formatSigned(point.kpi)}`,
    `Arrival Δ: ${formatSigned(metrics.arrival_accuracy_delta_week)}`,
    `Assured Time: ${metrics.assured_port_time_pct.toFixed(1)}%`,
    `Berth Var: ${metrics.berth_time_variance_h.toFixed(1)} h`,
    `Throughput: ${Intl.NumberFormat("en-US").format(metrics.throughput_teu_day)} TEU/day`,
  ];
  return lines.join("\n");
}

function formatSigned(value: number) {
  const formatted = value.toFixed(2);
  return value > 0 ? `+${formatted}` : formatted;
}

export default ARGlobe;

function styleScene(host: HTMLDivElement) {
  host.style.position = "relative";
  host.style.background = "transparent";

  const innerContainer = host.querySelector<HTMLDivElement>(":scope > div");
  if (innerContainer) {
    innerContainer.style.position = "absolute";
    innerContainer.style.inset = "0";
    innerContainer.style.width = "100%";
    innerContainer.style.height = "100%";
    innerContainer.style.background = "transparent";
    innerContainer.style.display = "flex";
    innerContainer.style.alignItems = "center";
    innerContainer.style.justifyContent = "center";
  }

  const scene = host.querySelector<HTMLElement>("a-scene");
  if (scene) {
    scene.style.position = "absolute";
    scene.style.inset = "0";
    scene.style.background = "transparent";
    const rendererAttr = scene.getAttribute("renderer");
    const newRenderer = [
      "alpha: true",
      "antialias: true",
      rendererAttr && typeof rendererAttr === "string" ? rendererAttr : null,
    ]
      .filter(Boolean)
      .join("; ");
    scene.setAttribute("renderer", newRenderer);
  }

  const canvas = host.querySelector<HTMLCanvasElement>("a-scene canvas");
  if (canvas) {
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.maxWidth = "100%";
    canvas.style.maxHeight = "100%";
    canvas.style.background = "transparent";
  }
}
