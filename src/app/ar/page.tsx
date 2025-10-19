"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { PortPoint } from "@/components/ar-globe";

const ARGlobe = dynamic(() => import("@/components/ar-globe"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[50vh] w-full items-center justify-center rounded-lg border border-white/10 bg-black/60 text-sm text-white/70">
      Initializing AR renderer…
    </div>
  ),
});

const markerHref = "https://ar-js-org.github.io/AR.js/data/images/HIRO.jpg";

const fallbackData: PortPoint[] = [
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
  const [ports, setPorts] = useState(fallbackData);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [scriptError, setScriptError] = useState<string | null>(null);

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
          setScriptError(
            error instanceof Error
              ? error.message
              : "Failed to load AR runtime libraries.",
          );
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
        setScriptError(
          "Camera access is not available in this browser. Try a recent mobile browser over HTTPS.",
        );
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
        setErrorMessage(
          error instanceof Error ? error.message : "Unknown error",
        );
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
    if (scriptError) return scriptError;
    if (!scriptsReady)
      return "Loading AR runtime… this can take a couple of seconds on mobile.";
    if (status === "loading")
      return "Preparing AR… Allow camera access when prompted.";
    if (status === "error")
      return "We could not load the latest KPI data. Showing sample data for now.";
    return "Point your device at the HIRO marker to anchor the globe.";
  }, [scriptError, scriptsReady, status]);

  return (
    <>
      <main className="relative flex min-h-screen flex-col items-center bg-gradient-to-b from-black via-slate-950 to-black text-white">
        <header className="z-20 w-full max-w-3xl space-y-3 px-4 py-6 text-center sm:px-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            AR Port Performance Globe
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-white/70 sm:text-base">
            {infoMessage}
          </p>
          {status === "error" && errorMessage && (
            <p className="mx-auto max-w-xl text-xs text-rose-300 sm:text-sm">
              {errorMessage}
            </p>
          )}

          <div className="flex flex-col items-center justify-center gap-3 text-sm text-white/70 sm:flex-row">
            <Link
              href={markerHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-4 py-2 text-white transition hover:border-white/60 hover:text-white"
            >
              Open HIRO Marker
            </Link>

            {status === "error" && (
              <button
                type="button"
                onClick={() => setReloadToken((token) => token + 1)}
                className="rounded-full border border-white/20 px-4 py-2 text-white transition hover:border-white/60 hover:text-white"
              >
                Try again
              </button>
            )}
          </div>
        </header>

        <section className="relative z-10 flex w-full flex-1 items-center justify-center px-4 pb-8 sm:px-8">
          <div className="relative h-full w-full max-w-4xl">
            <ARGlobe data={ports} ready={scriptsReady && !scriptError} />
            {!scriptsReady && !scriptError && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-white/60">
                Loading camera experience…
              </div>
            )}
          </div>
        </section>

        <footer className="z-20 w-full max-w-3xl px-4 pb-8 text-center text-xs text-white/50 sm:px-8">
          Works best on iOS Safari or Android Chrome over HTTPS. Lighting and
          marker contrast improve tracking stability.
        </footer>
      </main>
    </>
  );
}

function normalizePorts(raw: unknown): PortPoint[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((entry) => mapPort(entry))
    .filter((port): port is PortPoint => port !== null);
}

function mapPort(entry: unknown): PortPoint | null {
  if (!entry || typeof entry !== "object") return null;

  const { name, lat, lng, kpi, metrics } = entry as {
    name?: unknown;
    lat?: unknown;
    lng?: unknown;
    kpi?: unknown;
    metrics?: Record<string, number | string>;
  };

  if (typeof name !== "string") return null;

  const latitude = Number(lat);
  const longitude = Number(lng);
  const kpiValue = Number(kpi);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    !Number.isFinite(kpiValue)
  )
    return null;

  return {
    name,
    lat: latitude,
    lng: longitude,
    kpi: kpiValue,
    metrics,
  };
}
