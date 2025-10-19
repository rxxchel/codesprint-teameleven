"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import ChatSheet from "@/components/ar/chat-sheet";
import PortInfoCard from "@/components/ar/port-info-card";
import TopBar from "@/components/ar/top-bar";
import type { PortDatum } from "@/components/ar-globe";

const ARGlobe = dynamic(() => import("@/components/ar-globe"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[50vh] w-full items-center justify-center rounded-lg border border-white/10 bg-black/60 text-sm text-white/70">
      Initializing AR renderer…
    </div>
  ),
});

const markerHref = "https://ar-js-org.github.io/AR.js/data/images/HIRO.jpg";

const fallbackData: PortDatum[] = [
  {
    name: "Busan",
    lat: 35.1796,
    lng: 129.0756,
    kpi: -0.05,
    metrics: {
      arrival_accuracy_delta_week: -0.05,
      assured_port_time_pct: 92.1,
      berth_time_variance_h: 1.4,
      throughput_teu_day: 18500,
    },
  },
  {
    name: "Singapore",
    lat: 1.3521,
    lng: 103.8198,
    kpi: 0.08,
    metrics: {
      arrival_accuracy_delta_week: 0.08,
      assured_port_time_pct: 88.3,
      berth_time_variance_h: 3.1,
      throughput_teu_day: 29000,
    },
  },
  {
    name: "Shanghai",
    lat: 31.2304,
    lng: 121.4737,
    kpi: -0.12,
    metrics: {
      arrival_accuracy_delta_week: -0.12,
      assured_port_time_pct: 95.4,
      berth_time_variance_h: 0.9,
      throughput_teu_day: 32500,
    },
  },
  {
    name: "Rotterdam",
    lat: 51.9244,
    lng: 4.4777,
    kpi: 0.04,
    metrics: {
      arrival_accuracy_delta_week: 0.04,
      assured_port_time_pct: 86.7,
      berth_time_variance_h: 2.4,
      throughput_teu_day: 21000,
    },
  },
  {
    name: "Los Angeles",
    lat: 33.7405,
    lng: -118.276,
    kpi: 0.11,
    metrics: {
      arrival_accuracy_delta_week: 0.11,
      assured_port_time_pct: 82.6,
      berth_time_variance_h: 4.8,
      throughput_teu_day: 24500,
    },
  },
  {
    name: "Hamburg",
    lat: 53.5511,
    lng: 9.9937,
    kpi: -0.09,
    metrics: {
      arrival_accuracy_delta_week: -0.09,
      assured_port_time_pct: 91.2,
      berth_time_variance_h: 1.7,
      throughput_teu_day: 15800,
    },
  },
  {
    name: "Dubai (Jebel Ali)",
    lat: 25.0108,
    lng: 55.0618,
    kpi: -0.03,
    metrics: {
      arrival_accuracy_delta_week: -0.03,
      assured_port_time_pct: 93.7,
      berth_time_variance_h: 1.1,
      throughput_teu_day: 27000,
    },
  },
  {
    name: "Antwerp-Bruges",
    lat: 51.2637,
    lng: 4.4121,
    kpi: 0.06,
    metrics: {
      arrival_accuracy_delta_week: 0.06,
      assured_port_time_pct: 84.5,
      berth_time_variance_h: 3.3,
      throughput_teu_day: 19800,
    },
  },
  {
    name: "Santos",
    lat: -23.9618,
    lng: -46.328,
    kpi: 0.02,
    metrics: {
      arrival_accuracy_delta_week: 0.02,
      assured_port_time_pct: 89.6,
      berth_time_variance_h: 2.1,
      throughput_teu_day: 13400,
    },
  },
  {
    name: "Hong Kong",
    lat: 22.3193,
    lng: 114.1694,
    kpi: -0.07,
    metrics: {
      arrival_accuracy_delta_week: -0.07,
      assured_port_time_pct: 94.9,
      berth_time_variance_h: 1.3,
      throughput_teu_day: 27600,
    },
  },
  {
    name: "New York/New Jersey",
    lat: 40.6681,
    lng: -74.0451,
    kpi: 0.09,
    metrics: {
      arrival_accuracy_delta_week: 0.09,
      assured_port_time_pct: 83.9,
      berth_time_variance_h: 4.1,
      throughput_teu_day: 20500,
    },
  },
];

export default function ARPage() {
  const [scriptsReady, setScriptsReady] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [ports, setPorts] = useState<PortDatum[]>(fallbackData);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [selectedPort, setSelectedPort] = useState<PortDatum | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatPrefill, setChatPrefill] = useState<string | null>(null);
  const [chatContextPort, setChatContextPort] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadScript = (src: string, id: string) =>
      new Promise<void>((resolve, reject) => {
        if (typeof document === "undefined") {
          reject(new Error("DOM not available"));
          return;
        }
        if (document.querySelector(`script[data-ar-src="${id}"]`)) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = false;
        script.crossOrigin = "anonymous";
        script.dataset.arSrc = id;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      });

    const loadWithFallback = async (id: string, sources: string[]) => {
      for (const src of sources) {
        try {
          await loadScript(src, id);
          return;
        } catch (error) {
          console.warn(`[AR] Failed to load ${src}`, error);
          if (typeof document !== "undefined") {
            document
              .querySelector<HTMLScriptElement>(`script[data-ar-src="${id}"]`)
              ?.remove();
          }
        }
      }
      throw new Error(`Failed to load script group: ${sources.join(", ")}`);
    };

    const ensureARGlobals = async () => {
      if (typeof window === "undefined") return;
      const win = window as Window & {
        AFRAME?: { THREE?: unknown };
        THREE?: unknown;
      };

      const maxAttempts = 40;
      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        if (win.AFRAME) {
          if (win.AFRAME.THREE && !win.THREE) {
            win.THREE = win.AFRAME.THREE;
          }
          return;
        }
        await sleep(100);
      }

      throw new Error("A-Frame runtime did not register on window in time");
    };

    async function loadRuntime() {
      try {
        await loadWithFallback("aframe", [
          "https://cdn.jsdelivr.net/npm/aframe",
          "https://aframe.io/releases/1.5.0/aframe.min.js",
        ]);
        await loadWithFallback("arjs", [
          "https://cdn.jsdelivr.net/npm/@ar-js-org/ar.js",
          "https://unpkg.com/@ar-js-org/ar.js@3.4.4/aframe/build/aframe-ar.min.js",
        ]);
        await ensureARGlobals();
        if (!isCancelled) {
          setScriptsReady(true);
          setScriptError(null);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error(error);
          const message =
            error instanceof Error
              ? error.message
              : "Failed to load AR runtime libraries.";
          setScriptError(message);
          toast.error(message);
          setScriptsReady(false);
        }
      }
    }

    loadRuntime();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const supportsCamera =
        typeof navigator.mediaDevices?.getUserMedia === "function";
      if (!supportsCamera) {
        const message =
          "Camera access is not available in this browser. Try a recent mobile browser over HTTPS.";
        setScriptError(message);
        toast.error(message);
      }
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setStatus("loading");
      setErrorMessage(null);

      try {
        const response = await fetch("/data/reference-sample-data.json", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const json = await response.json();
        const parsedPorts = normalizePorts(json?.ports);

        if (isCancelled) return;

        setPorts(parsedPorts.length > 0 ? parsedPorts : fallbackData);
        setStatus("ready");
      } catch (error) {
        if (isCancelled) return;
        console.error("Failed to load AR port data", error);
        const message =
          error instanceof Error ? error.message : "Unknown error";
        setErrorMessage(message);
        toast.error("Port data unavailable, showing cached sample data.");
        setPorts(fallbackData);
        setStatus("error");
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [reloadToken]);

  const infoMessage = useMemo(() => {
    if (scriptError)
      return "We couldn’t initialize the AR runtime. Refresh the page or try a different mobile browser.";
    if (!scriptsReady)
      return "Loading the AR runtime… this may take a few seconds on mobile networks.";
    if (status === "loading")
      return "Preparing the KPI data feed and calibrating the globe.";
    if (status === "error")
      return "Showing cached sample data for now. Reload when your connection improves.";
    return "Point your device at the HIRO marker to anchor the globe in your space.";
  }, [scriptError, scriptsReady, status]);

  const overlayState = useMemo(() => {
    if (scriptError) {
      return {
        title: "AR runtime unavailable",
        body: "We couldn’t initialize the AR engine. Reload the page or switch to a recent mobile browser with camera access enabled.",
      };
    }
    if (!scriptsReady) {
      return {
        title: "Loading AR runtime",
        body: "Fetching the required A-Frame and AR.js scripts… Allow camera access when prompted.",
      };
    }
    if (!sceneReady) {
      return {
        title: "Initializing globe",
        body: "Calibrating the marker and preparing the 3D scene.",
      };
    }
    if (status === "loading") {
      return {
        title: "Preparing data",
        body: "Fetching the latest KPI feed and aligning the globe.",
      };
    }
    return null;
  }, [sceneReady, scriptError, scriptsReady, status]);

  const dataBadge = useMemo(() => {
    switch (status) {
      case "ready":
        return {
          label: "Live KPI feed",
          tone: "ready" as const,
        };
      case "error":
        return {
          label: "Sample data (offline)",
          tone: "error" as const,
        };
      default:
        return {
          label: "Preparing data",
          tone: "loading" as const,
        };
    }
  }, [status]);

  const handlePortSelect = (port: PortDatum) => {
    setSelectedPort(port);
    setChatContextPort(port.name);
  };

  const closePortCard = () => {
    setSelectedPort(null);
  };

  const handleAskAI = (prefill: string, portName: string) => {
    setChatPrefill(prefill);
    setChatContextPort(portName);
    setIsChatOpen(true);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="fixed inset-0 h-[100dvh] w-[100dvw] overflow-hidden">
        {scriptsReady && !scriptError ? (
          <ARGlobe
            data={ports}
            selected={selectedPort?.name}
            onSelect={handlePortSelect}
            onReady={() => setSceneReady(true)}
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),transparent_65%),#020617]" />
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-black/90 via-black/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      <TopBar
        badgeLabel={dataBadge.label}
        status={dataBadge.tone}
        onOpenChat={() => setIsChatOpen(true)}
        isChatOpen={isChatOpen}
      />

      <AnimatePresence>
        {overlayState && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-md rounded-2xl border border-white/20 bg-black/70 px-6 py-5 text-sm leading-relaxed text-white/80 backdrop-blur-lg sm:text-base">
              <p className="text-base font-semibold text-white sm:text-lg">
                {overlayState.title}
              </p>
              <p className="mt-3 text-sm text-white/80 sm:text-base">
                {overlayState.body}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FooterPanel
        status={status}
        errorMessage={errorMessage}
        infoMessage={infoMessage}
        onRetry={() => setReloadToken((token) => token + 1)}
      />

      <AnimatePresence>
        {selectedPort && (
          <>
            <motion.div
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePortCard}
            />
            <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(24px+env(safe-area-inset-bottom,0px))]">
              <PortInfoCard
                port={selectedPort}
                onClose={closePortCard}
                onAskAI={(prefill) => handleAskAI(prefill, selectedPort.name)}
              />
            </div>
          </>
        )}
      </AnimatePresence>

      <ChatSheet
        open={isChatOpen}
        onOpenChange={(open) => {
          setIsChatOpen(open);
          if (!open) {
            setChatPrefill(null);
          }
        }}
        prefill={chatPrefill}
        activePortName={chatContextPort ?? selectedPort?.name ?? null}
      />
    </main>
  );
}

type FooterPanelProps = {
  status: "loading" | "ready" | "error";
  errorMessage: string | null;
  infoMessage: string;
  onRetry: () => void;
};

function FooterPanel({
  status,
  errorMessage,
  infoMessage,
  onRetry,
}: FooterPanelProps) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(32px+env(safe-area-inset-bottom,0px))] sm:px-8"
      style={{ pointerEvents: "none" }}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pointer-events-auto">
        <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base">
          <Link
            href={markerHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full border border-white/20 bg-white/15 px-4 py-2 font-medium text-white transition hover:bg-white/25"
          >
            Open HIRO Marker
          </Link>

          {status === "error" && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 font-medium text-white transition hover:bg-white/20"
            >
              Try again
            </button>
          )}
        </div>

        {status === "error" && errorMessage && (
          <div className="max-w-md rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-100 sm:text-sm">
            {errorMessage}
          </div>
        )}

        <div className="max-w-2xl rounded-2xl border border-white/15 bg-black/60 px-4 py-4 text-xs text-white/70 backdrop-blur-sm sm:text-sm">
          {infoMessage}
        </div>
      </div>
    </div>
  );
}

function normalizePorts(raw: unknown): PortDatum[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((entry) => mapPort(entry))
    .filter((port): port is PortDatum => port !== null);
}

function mapPort(entry: unknown): PortDatum | null {
  if (!entry || typeof entry !== "object") return null;

  const { name, lat, lng, kpi, metrics } = entry as {
    name?: unknown;
    lat?: unknown;
    lng?: unknown;
    kpi?: unknown;
    metrics?: Record<string, unknown>;
  };

  if (typeof name !== "string") return null;

  const latitude = Number(lat);
  const longitude = Number(lng);
  const kpiValue = Number(kpi);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    !Number.isFinite(kpiValue)
  ) {
    return null;
  }

  const metricsObj = metrics ?? {};
  const arrival = Number(
    (metricsObj as Record<string, unknown>).arrival_accuracy_delta_week,
  );
  const assured = Number(
    (metricsObj as Record<string, unknown>).assured_port_time_pct,
  );
  const variance = Number(
    (metricsObj as Record<string, unknown>).berth_time_variance_h,
  );
  const throughput = Number(
    (metricsObj as Record<string, unknown>).throughput_teu_day,
  );

  if (
    !Number.isFinite(arrival) ||
    !Number.isFinite(assured) ||
    !Number.isFinite(variance) ||
    !Number.isFinite(throughput)
  ) {
    return null;
  }

  return {
    name,
    lat: latitude,
    lng: longitude,
    kpi: kpiValue,
    metrics: {
      arrival_accuracy_delta_week: arrival,
      assured_port_time_pct: assured,
      berth_time_variance_h: variance,
      throughput_teu_day: throughput,
    },
  };
}
