"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

import { VisualizationMode } from "@/lib/ar-visualization";

type AccuracyFlag = "Y" | "N" | null;

export type PortDatum = {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  arrivalAccuracy: AccuracyFlag;
  assuredPortTimeRatio: number;
  berthTimeHours: number;
  bunkerSavedUsd: number;
  carbonAbatementTonnes: number;
  latestVessel: string | null;
  latestRotation: string | null;
  arrivalVarianceHours: number | null;
  waitTimeAtbBtrHours: number | null;
  sampleCount: number;
  lastUpdated: number | null;
};

export type PortEndpoint = {
  code: string;
  name: string;
  lat: number;
  lng: number;
};

export type VesselTrail = {
  id: string;
  from: PortEndpoint;
  to: PortEndpoint;
  arrivalAccuracy: AccuracyFlag;
  bunkerSavedUsd: number;
  carbonAbatementTonnes: number;
};

export type ARVisualizationData = {
  ports: PortDatum[];
  trails: VesselTrail[];
  bunkerSavedStats: {
    median: number;
    p90: number;
  };
};

type GlowObject = {
  group: any;
  baseScale: number;
  intensity: number;
  pulseSpeed: number;
  material?: any;
};

type GlobeInstance = {
  pointsData: (data: PortDatum[]) => GlobeInstance;
  pointLat: (accessor: (point: PortDatum) => number) => GlobeInstance;
  pointLng: (accessor: (point: PortDatum) => number) => GlobeInstance;
  pointAltitude: (accessor: (point: PortDatum) => number) => GlobeInstance;
  pointColor: (accessor: (point: PortDatum) => string) => GlobeInstance;
  pointRadius: (accessor: (point: PortDatum) => number) => GlobeInstance;
  pointLabel?: (accessor: (point: PortDatum) => string) => GlobeInstance;
  pointResolution?: (segments: number) => GlobeInstance;
  pointsTransitionDuration?: (duration: number) => GlobeInstance;
  arcsData: (data: VesselTrail[]) => GlobeInstance;
  arcStartLat: (accessor: (trail: VesselTrail) => number) => GlobeInstance;
  arcStartLng: (accessor: (trail: VesselTrail) => number) => GlobeInstance;
  arcEndLat: (accessor: (trail: VesselTrail) => number) => GlobeInstance;
  arcEndLng: (accessor: (trail: VesselTrail) => number) => GlobeInstance;
  arcAltitude: (accessor: (trail: VesselTrail) => number) => GlobeInstance;
  arcStroke: (accessor: (trail: VesselTrail) => number | null) => GlobeInstance;
  arcColor: (
    accessor: (trail: VesselTrail) => string | string[],
  ) => GlobeInstance;
  arcDashLength: (accessor: (trail: VesselTrail) => number) => GlobeInstance;
  arcDashGap: (accessor: (trail: VesselTrail) => number) => GlobeInstance;
  arcDashInitialGap: (
    accessor: (trail: VesselTrail) => number,
  ) => GlobeInstance;
  arcDashAnimateTime: (
    accessor: (trail: VesselTrail) => number,
  ) => GlobeInstance;
  arcsTransitionDuration?: (duration: number) => GlobeInstance;
  customLayerData: (data: PortDatum[]) => GlobeInstance;
  customThreeObject: (factory: (datum: PortDatum) => unknown) => GlobeInstance;
  customThreeObjectUpdate: (
    updater: (obj: unknown, datum: PortDatum) => void,
  ) => GlobeInstance;
  globeImageUrl: (url: string) => GlobeInstance;
  width?: (value: number) => GlobeInstance;
  height?: (value: number) => GlobeInstance;
  resetProps?: () => GlobeInstance;
  _destructor?: () => void;
  getCoords?: (
    lat: number,
    lng: number,
    altitude?: number,
  ) => {
    x: number;
    y: number;
    z: number;
  };
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
  data: ARVisualizationData;
  mode: VisualizationMode;
  selected?: string | null;
  onSelect?: (port: PortDatum) => void;
  onReady?: () => void;
};

const EARTH_TEXTURE =
  "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";

export function ARGlobe({
  data,
  mode,
  selected,
  onSelect,
  onReady,
}: ARGlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const selectHandlerRef = useRef<ARGlobeProps["onSelect"]>(onSelect);
  const readyHandlerRef = useRef<ARGlobeProps["onReady"]>(onReady);
  const dataRef = useRef<ARVisualizationData>(data);
  const modeRef = useRef<VisualizationMode>(mode);
  const glowObjectsRef = useRef<GlowObject[]>([]);
  const animationRef = useRef<number | null>(null);

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
    modeRef.current = mode;
  }, [mode]);

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

        globe.pointsTransitionDuration?.(250);
        globe.arcsTransitionDuration?.(300);
        globe.pointResolution?.(24);

        globe
          .globeImageUrl(EARTH_TEXTURE)
          .pointLat((point) => point.lat)
          .pointLng((point) => point.lng)
          .arcStartLat((trail) => trail.from.lat)
          .arcStartLng((trail) => trail.from.lng)
          .arcEndLat((trail) => trail.to.lat)
          .arcEndLng((trail) => trail.to.lng);

        if (globe.pointLabel) {
          globe.pointLabel((point) => formatHeatmapTooltip(point));
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

        globe.pointsData(dataRef.current.ports);
        globe.arcsData([]);
        globe.customLayerData([]);
        globeRef.current = globe;
        readyHandlerRef.current?.();
        applyVisualization(
          globe,
          modeRef.current,
          dataRef.current,
          selected ?? null,
          glowObjectsRef,
        );
      } catch (error) {
        console.error("[AR] Failed to load globe-ar", error);
      }
    }

    loadGlobe();

    return () => {
      isCancelled = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (glowObjectsRef.current.length) {
        glowObjectsRef.current = [];
      }
      if (globeRef.current?._destructor) {
        globeRef.current._destructor();
      }
      globeRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      document.body.style.cursor = "auto";
    };
  }, [selected]);

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
    applyVisualization(
      globeRef.current,
      mode,
      data,
      selected ?? null,
      glowObjectsRef,
    );
  }, [data, mode, selected]);

  useEffect(() => {
    if (mode !== VisualizationMode.SUSTAINABILITY_OVERLAY) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const animate = (time: number) => {
      const items = glowObjectsRef.current;
      if (items.length === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      for (const glow of items) {
        const amplitude = 0.06 + glow.intensity * 0.12;
        const scale =
          glow.baseScale +
          Math.sin((time / 1000) * glow.pulseSpeed) * amplitude;
        glow.group.scale.setScalar(scale);

        if (glow.material) {
          const baseOpacity = 0.28 + glow.intensity * 0.4;
          const pulse =
            0.05 * Math.cos((time / 1000) * (glow.pulseSpeed * 1.5));
          glow.material.opacity = clamp(baseOpacity + pulse, 0.15, 0.85);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [mode]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-transparent"
    />
  );
}

function applyVisualization(
  globe: GlobeInstance,
  mode: VisualizationMode,
  dataset: ARVisualizationData,
  selected: string | null,
  glowObjectsRef: MutableRefObject<GlowObject[]>,
) {
  switch (mode) {
    case VisualizationMode.GLOBAL_PERF_HEATMAP: {
      glowObjectsRef.current = [];
      applyHeatmapMode(globe, dataset.ports, selected);
      globe.customLayerData([]);
      globe.arcsData([]);
      break;
    }
    case VisualizationMode.SUSTAINABILITY_OVERLAY: {
      glowObjectsRef.current = applySustainabilityMode(globe, dataset);
      break;
    }
    case VisualizationMode.VESSEL_TRAILS: {
      glowObjectsRef.current = [];
      applyVesselTrailsMode(globe, dataset, selected);
      break;
    }
    default: {
      glowObjectsRef.current = [];
    }
  }
}

function applyHeatmapMode(
  globe: GlobeInstance,
  ports: PortDatum[],
  selected: string | null,
) {
  globe.pointsData(ports);
  globe.arcsData([]);

  globe.pointRadius((point) => {
    const base = mapRange(
      clamp(point.assuredPortTimeRatio, 0, 1),
      0,
      1,
      0.08,
      0.24,
    );
    if (selected && point.id === selected) {
      return base * 1.25;
    }
    return base;
  });

  globe.pointAltitude((point) =>
    mapRange(clamp(point.berthTimeHours, 0, 40), 0, 40, 0.05, 0.52),
  );

  globe.pointColor((point) =>
    getAccuracyColor(point.arrivalAccuracy, point.id === selected),
  );

  if (globe.pointLabel) {
    globe.pointLabel((point) => formatHeatmapTooltip(point));
  }
}

function applySustainabilityMode(
  globe: GlobeInstance,
  dataset: ARVisualizationData,
) {
  const ports = dataset.ports;
  globe.arcsData([]);
  globe.pointsData(ports);

  globe.pointRadius((point) =>
    mapRange(clamp(point.carbonAbatementTonnes, 0, 0.5), 0, 0.5, 0.06, 0.16),
  );
  globe.pointAltitude(() => 0.09);
  globe.pointColor((point) => getSustainabilityColor(point));

  if (globe.pointLabel) {
    globe.pointLabel((point) => formatSustainabilityTooltip(point));
  }

  const three = getThree();
  if (!three) {
    globe.customLayerData([]);
    return [];
  }

  const t = three as any;
  const glowRefs: GlowObject[] = [];
  const median = dataset.bunkerSavedStats.median;

  globe.customLayerData([]);
  globe.customThreeObject(() => {
    const group = new t.Group();
    const material = new t.MeshBasicMaterial({
      color: 0x2dd4bf,
      transparent: true,
      opacity: 0.32,
      side: t.DoubleSide,
      depthWrite: false,
    });
    const ring = new t.Mesh(new t.RingGeometry(1, 1.1, 64), material);
    ring.renderOrder = 2;
    group.add(ring);
    glowRefs.push({
      group,
      baseScale: 1,
      intensity: 0,
      pulseSpeed: 1.1,
      material,
    });
    return group;
  });

  globe.customThreeObjectUpdate((obj, port) => {
    const group = obj as any;
    const record = glowRefs.find((entry) => entry.group === group);
    if (!group || !record) return;

    const intensity = clamp(port.carbonAbatementTonnes, 0, 0.5) / 0.5;
    record.intensity = intensity;
    record.pulseSpeed = port.bunkerSavedUsd > median ? 1.75 : 1.15;
    record.baseScale = 1 + intensity * 0.45;

    const ring = group.children?.[0] as any;
    if (ring) {
      const innerRadius = 0.18 + intensity * 0.14;
      const outerRadius = innerRadius + 0.08 + intensity * 0.08;
      ring.geometry?.dispose?.();
      ring.geometry = new t.RingGeometry(innerRadius, outerRadius, 80);
      if (ring.material) {
        ring.material.opacity = 0.3 + intensity * 0.45;
        record.material = ring.material;
      }
    }

    const coords = globe.getCoords?.(port.lat, port.lng, 0.05);
    if (!coords) return;

    group.position.set(coords.x, coords.y, coords.z);

    const normal = new t.Vector3(coords.x, coords.y, coords.z).normalize();
    const up = new t.Vector3(0, 0, 1);
    group.quaternion.copy(new t.Quaternion().setFromUnitVectors(up, normal));
    group.scale.setScalar(record.baseScale);
  });

  globe.customLayerData(ports);
  return glowRefs;
}

function applyVesselTrailsMode(
  globe: GlobeInstance,
  dataset: ARVisualizationData,
  selected: string | null,
) {
  const ports = dataset.ports;
  const trails = dataset.trails;
  const p90 = dataset.bunkerSavedStats.p90 || 1;

  globe.customLayerData([]);
  globe.pointsData(ports);
  globe.arcsData(trails);

  globe.pointRadius((point) => (point.id === selected ? 0.12 : 0.08));
  globe.pointAltitude(() => 0.06);
  globe.pointColor((point) =>
    getAccuracyColor(point.arrivalAccuracy, point.id === selected),
  );

  if (globe.pointLabel) {
    globe.pointLabel((point) => formatTrailTooltip(point));
  }

  globe.arcAltitude(() => 0.28);
  globe.arcStroke(() => 0.65);
  globe.arcColor((trail) => getArcColor(trail, p90));
  globe.arcDashLength(() => 0.35);
  globe.arcDashGap(() => 0.65);
  globe.arcDashInitialGap((trail) => (trail.arrivalAccuracy === "Y" ? 0 : 0.4));
  globe.arcDashAnimateTime((trail) => getArcAnimateTime(trail, p90));
}

function getAccuracyColor(flag: AccuracyFlag, emphasize = false) {
  const base = flag === "Y" ? "#34d399" : flag === "N" ? "#f87171" : "#94a3b8";
  if (!emphasize) return base;
  return lightenHex(base, 0.25);
}

function getSustainabilityColor(port: PortDatum) {
  const intensity = clamp(port.carbonAbatementTonnes, 0, 0.5) / 0.5;
  const start = { r: 16, g: 185, b: 129 };
  const end = { r: 110, g: 231, b: 183 };
  const r = Math.round(start.r + (end.r - start.r) * intensity);
  const g = Math.round(start.g + (end.g - start.g) * intensity);
  const b = Math.round(start.b + (end.b - start.b) * intensity);
  return `rgb(${r}, ${g}, ${b})`;
}

function getArcColor(trail: VesselTrail, p90: number) {
  const normalized = clamp(trail.bunkerSavedUsd / (p90 || 1), 0.25, 1);
  const [r, g, b] =
    trail.arrivalAccuracy === "Y" ? [52, 211, 153] : [248, 113, 113];
  return `rgba(${r}, ${g}, ${b}, ${normalized.toFixed(2)})`;
}

function getArcAnimateTime(trail: VesselTrail, p90: number) {
  const normalized = clamp(trail.bunkerSavedUsd / (p90 || 1), 0, 1);
  const min = 2800;
  const max = 5200;
  return Math.round(max - (max - min) * normalized);
}

function formatHeatmapTooltip(point: PortDatum) {
  const assuredPercent = (
    clamp(point.assuredPortTimeRatio, 0, 1) * 100
  ).toFixed(1);
  const lines = [
    point.name,
    point.latestVessel
      ? `Latest vessel: ${point.latestVessel}`
      : "Latest vessel: —",
    `Assured Port Time: ${assuredPercent}%`,
    `Berth Time: ${point.berthTimeHours.toFixed(1)} h`,
  ];
  return lines.join("\n");
}

function formatSustainabilityTooltip(point: PortDatum) {
  const lines = [
    point.name,
    `Carbon Abatement: ${point.carbonAbatementTonnes.toFixed(3)} t`,
    `Bunker Saved: ${formatCurrency(point.bunkerSavedUsd)}`,
  ];
  return lines.join("\n");
}

function formatTrailTooltip(point: PortDatum) {
  const lines = [
    point.name,
    `On-time arrival: ${formatArrivalAccuracy(point.arrivalAccuracy)}`,
    `Bunker Saved: ${formatCurrency(point.bunkerSavedUsd)}`,
  ];
  return lines.join("\n");
}

function formatArrivalAccuracy(flag: AccuracyFlag) {
  if (flag === "Y") return "Yes";
  if (flag === "N") return "No";
  return "Not reported";
}

function lightenHex(hex: string, ratio: number) {
  const value = hex.startsWith("#") ? hex.slice(1) : hex;
  if (value.length !== 6) return hex;

  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);

  const mix = (component: number) =>
    Math.round(component + (255 - component) * ratio);

  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

function toHex(value: number) {
  return value.toString(16).padStart(2, "0");
}

function formatCurrency(value: number) {
  if (!Number.isFinite(value) || value === 0) return "$0";
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value.toFixed(0)}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  if (inMax - inMin === 0) return outMin;
  const clamped = clamp(value, inMin, inMax);
  const ratio = (clamped - inMin) / (inMax - inMin);
  return outMin + ratio * (outMax - outMin);
}

function getThree(): any | null {
  if (typeof window === "undefined") return null;
  const win = window as RuntimeWindow;
  const three = win.THREE ?? win.AFRAME?.THREE;
  return (three as any) ?? null;
}

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

export default ARGlobe;
