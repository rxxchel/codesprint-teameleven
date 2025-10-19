"use client";

import { useEffect, useRef } from "react";

export type PortPoint = {
  name: string;
  lat: number;
  lng: number;
  kpi: number;
  metrics?: Record<string, number | string>;
};

type GlobeInstance = {
  pointsData: (data: PortPoint[]) => GlobeInstance;
  labelsData: (data: PortPoint[]) => GlobeInstance;
  globeImageUrl: (url: string) => GlobeInstance;
  pointLat: (accessor: (point: PortPoint) => number) => GlobeInstance;
  pointLng: (accessor: (point: PortPoint) => number) => GlobeInstance;
  pointAltitude: (accessor: (point: PortPoint) => number) => GlobeInstance;
  pointColor: (accessor: (point: PortPoint) => string) => GlobeInstance;
  pointRadius: (value: number) => GlobeInstance;
  labelText: (accessor: (point: PortPoint) => string) => GlobeInstance;
  labelAltitude: (accessor: (point: PortPoint) => number) => GlobeInstance;
  width?: (value: number) => GlobeInstance;
  height?: (value: number) => GlobeInstance;
  resetProps?: () => GlobeInstance;
  _destructor?: () => void;
  pointLabel?: (accessor: (point: PortPoint) => string) => GlobeInstance;
};

type GlobeARConstructor = new (
  element: HTMLElement,
  config?: { markerAttrs?: Record<string, unknown> },
) => GlobeInstance;

type RuntimeWindow = Window & {
  AFRAME?: { THREE?: unknown };
  THREE?: unknown;
};

type Props = {
  data: PortPoint[];
  ready: boolean;
};

const EARTH_TEXTURE =
  "https://unpkg.com/three-globe/example/img/earth-dark.jpg";

export function ARGlobe({ data, ready }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<GlobeInstance | null>(null);

  useEffect(() => {
    if (!ready || !containerRef.current || globeRef.current) return;

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

        console.log("[AR] Instantiating globe-ar");
        const globe = new GlobeARModule(containerRef.current, {
          markerAttrs: { preset: "hiro" },
        });

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        globe.resetProps?.();
        width && globe.width?.(width);
        height && globe.height?.(height);

        globe
          .globeImageUrl(EARTH_TEXTURE)
          .pointLat((point) => point.lat)
          .pointLng((point) => point.lng)
          .pointAltitude(getAltitude)
          .pointColor(getPointColor)
          .pointRadius(0.25)
          .labelsData(data)
          .labelText((point) => point.name)
          .labelAltitude((point) => getAltitude(point) + 0.025);

        if (globe.pointLabel) {
          globe.pointLabel((point) => formatTooltip(point));
        }

        globeRef.current = globe;
      } catch (error) {
        console.error("[AR] Failed to load globe-ar", error);
      }
    }

    loadGlobe();

    return () => {
      isCancelled = true;
      if (globeRef.current?._destructor) {
        globeRef.current._destructor();
      }
      globeRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    if (!globeRef.current || !ready) return;
    globeRef.current.pointsData(data).labelsData(data);
  }, [data, ready]);

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-4rem)] w-full rounded-lg border border-white/10 bg-black/60"
    />
  );
}

function getAltitude(point: PortPoint) {
  const base = 0.05;
  const scaled = Math.min(0.3, Math.abs(point.kpi) * 0.2);
  return base + scaled;
}

function getPointColor(point: PortPoint) {
  return point.kpi > 0 ? "#ef4444" : "#10b981";
}

function formatTooltip(point: PortPoint) {
  const lines: string[] = [`${point.name}`, `KPI Δ: ${point.kpi.toFixed(2)}`];
  if (point.metrics) {
    Object.entries(point.metrics).forEach(([key, value]) => {
      lines.push(`${key}: ${value}`);
    });
  }
  return lines.join("\n");
}

export default ARGlobe;
