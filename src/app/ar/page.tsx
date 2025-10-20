"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import ArCopilot from "@/components/ar/ar-copilot";
import PortInfoCard from "@/components/ar/port-info-card";
import TopBar from "@/components/ar/top-bar";
import type { ARVisualizationData, PortDatum } from "@/components/ar-globe";
import { VisualizationMode } from "@/lib/ar-visualization";
import { BU_COORDINATES, PORT_COORDINATES } from "@/lib/port-geo";

const ARGlobe = dynamic(() => import("@/components/ar-globe"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[50vh] w-full items-center justify-center rounded-lg border border-white/10 bg-black/60 text-sm text-white/70">
      Initializing AR renderer…
    </div>
  ),
});

const markerHref = "https://ar-js-org.github.io/AR.js/data/images/HIRO.jpg";

type RawPortRow = Record<string, unknown>;

const FALLBACK_ROWS: RawPortRow[] = [
  {
    BU: "PANAMA CITY",
    Vessel: "MV RAPID VOYAGER",
    "Rotation No.": "20251001",
    From: "JPTYO",
    To: "USSEA",
    "Final BTR (Local Time)": "23-04-25 7:35",
    "Arrival Variance (within 4h target)": "3.9",
    "Arrival Accuracy (Final BTR)": "Y",
    "Wait Time (Hours): ATB-BTR": "-4.92",
    "Berth Time (hours): ATU - ATB": "31.26",
    "Assured Port Time Achieved (%)": "0.25",
    "Bunker Saved (USD)": "35776.21",
    "Carbon Abatement (Tonnes)": "0.204",
  },
  {
    BU: "LAEM CHABANG",
    Vessel: "MV WESTERN AURORA",
    "Rotation No.": "20251003",
    From: "JPTYO",
    To: "ESALG",
    "Final BTR (Local Time)": "14-08-25 9:57",
    "Arrival Variance (within 4h target)": "3.29",
    "Arrival Accuracy (Final BTR)": "Y",
    "Wait Time (Hours): ATB-BTR": "-8.83",
    "Berth Time (hours): ATU - ATB": "8",
    "Assured Port Time Achieved (%)": "0.1549",
    "Bunker Saved (USD)": "19575.91",
    "Carbon Abatement (Tonnes)": "0.135",
  },
  {
    BU: "DAMMAM",
    Vessel: "MV TRUST SEAL",
    "Rotation No.": "20251005",
    From: "JPOSA",
    To: "ITGIT",
    "Final BTR (Local Time)": "13-03-25 0:40",
    "Arrival Variance (within 4h target)": "3.65",
    "Arrival Accuracy (Final BTR)": "Y",
    "Wait Time (Hours): ATB-BTR": "5.97",
    "Berth Time (hours): ATU - ATB": "42.38",
    "Assured Port Time Achieved (%)": "0.1327",
    "Bunker Saved (USD)": "18299.25",
    "Carbon Abatement (Tonnes)": "0.232",
  },
  {
    BU: "BUSAN",
    Vessel: "MV BRIGHT DOLPHIN",
    "Rotation No.": "20251006",
    From: "USSEA",
    To: "JPTYO",
    "Final BTR (Local Time)": "29-03-25 8:53",
    "Arrival Variance (within 4h target)": "0.39",
    "Arrival Accuracy (Final BTR)": "Y",
    "Wait Time (Hours): ATB-BTR": "5.63",
    "Berth Time (hours): ATU - ATB": "30.59",
    "Assured Port Time Achieved (%)": "0.1767",
    "Bunker Saved (USD)": "15986.41",
    "Carbon Abatement (Tonnes)": "0.162",
  },
  {
    BU: "JAKARTA",
    Vessel: "MV EMERALD ORCA",
    "Rotation No.": "20251007",
    From: "GRPIR",
    To: "KRPUS",
    "Final BTR (Local Time)": "13-08-25 12:13",
    "Arrival Variance (within 4h target)": "0.81",
    "Arrival Accuracy (Final BTR)": "Y",
    "Wait Time (Hours): ATB-BTR": "1.86",
    "Berth Time (hours): ATU - ATB": "28.51",
    "Assured Port Time Achieved (%)": "0.2363",
    "Bunker Saved (USD)": "30093.78",
    "Carbon Abatement (Tonnes)": "0.298",
  },
  {
    BU: "SINGAPORE",
    Vessel: "MV RAPID HORIZON",
    "Rotation No.": "20251009",
    From: "VNSGN",
    To: "DEHAM",
    "Final BTR (Local Time)": "26-08-25 15:01",
    "Arrival Variance (within 4h target)": "3.55",
    "Arrival Accuracy (Final BTR)": "Y",
    "Wait Time (Hours): ATB-BTR": "-6.72",
    "Berth Time (hours): ATU - ATB": "50.84",
    "Assured Port Time Achieved (%)": "0.0849",
    "Bunker Saved (USD)": "15058.17",
    "Carbon Abatement (Tonnes)": "0.162",
  },
  {
    BU: "TIANJIN",
    Vessel: "MV ATLANTIC HERON",
    "Rotation No.": "20251011",
    From: "CNXMN",
    To: "CNYTN",
    "Final BTR (Local Time)": "29-01-25 17:05",
    "Arrival Variance (within 4h target)": "2.17",
    "Arrival Accuracy (Final BTR)": "Y",
    "Wait Time (Hours): ATB-BTR": "4.55",
    "Berth Time (hours): ATU - ATB": "30.48",
    "Assured Port Time Achieved (%)": "0.1207",
    "Bunker Saved (USD)": "971.07",
    "Carbon Abatement (Tonnes)": "0.1",
  },
  {
    BU: "MUMBAI",
    Vessel: "MV WESTERN CORAL",
    "Rotation No.": "20251012",
    From: "ESALG",
    To: "VNSGN",
    "Final BTR (Local Time)": "20-04-25 13:48",
    "Arrival Variance (within 4h target)": "5.48",
    "Arrival Accuracy (Final BTR)": "N",
    "Wait Time (Hours): ATB-BTR": "2.23",
    "Berth Time (hours): ATU - ATB": "45.26",
    "Assured Port Time Achieved (%)": "0.235",
    "Bunker Saved (USD)": "32472.13",
    "Carbon Abatement (Tonnes)": "0.231",
  },
  {
    BU: "ANTWERP",
    Vessel: "MV GOLDEN DOLPHIN",
    "Rotation No.": "20251030",
    From: "CNSHA",
    To: "USSEA",
    "Final BTR (Local Time)": "09-03-25 13:21",
    "Arrival Variance (within 4h target)": "1.88",
    "Arrival Accuracy (Final BTR)": "Y",
    "Wait Time (Hours): ATB-BTR": "8.62",
    "Berth Time (hours): ATU - ATB": "37.82",
    "Assured Port Time Achieved (%)": "0.0834",
    "Bunker Saved (USD)": "14546.92",
    "Carbon Abatement (Tonnes)": "0.1",
  },
];

const fallbackVisualizationData = normalizeVisualizationData(FALLBACK_ROWS);

export default function ARPage() {
  const [scriptsReady, setScriptsReady] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [visualizationData, setVisualizationData] =
    useState<ARVisualizationData>(fallbackVisualizationData);
  const [visualizationMode, setVisualizationMode] = useState<VisualizationMode>(
    VisualizationMode.GLOBAL_PERF_HEATMAP,
  );
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [selectedPortId, setSelectedPortId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatPrefill, setChatPrefill] = useState<string | null>(null);
  const [chatContextPort, setChatContextPort] = useState<string | null>(null);

  const selectedPort = useMemo(() => {
    if (!selectedPortId) return null;
    return (
      visualizationData.ports.find((port) => port.id === selectedPortId) ?? null
    );
  }, [selectedPortId, visualizationData]);

  useEffect(() => {
    if (!selectedPortId) return;
    if (!visualizationData.ports.some((port) => port.id === selectedPortId)) {
      setSelectedPortId(null);
    }
  }, [selectedPortId, visualizationData]);

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
        const response = await fetch("/api/ar/reference-data", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const json = await response.json();
        const normalized = normalizeVisualizationData(json);

        if (isCancelled) return;

        if (normalized.ports.length > 0) {
          setVisualizationData(normalized);
          setStatus("ready");
        } else {
          setVisualizationData(fallbackVisualizationData);
          setStatus("error");
          setErrorMessage("Live dataset returned no port records.");
          toast.error(
            "Live dataset returned no port records, showing sample data.",
          );
        }
      } catch (error) {
        if (isCancelled) return;
        console.error("Failed to load AR port data", error);
        const message =
          error instanceof Error ? error.message : "Unknown error";
        setErrorMessage(message);
        toast.error("Port data unavailable, showing cached sample data.");
        setVisualizationData(fallbackVisualizationData);
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
          label: "Live feed",
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
    setSelectedPortId(port.id);
    setChatContextPort(port.name);
  };

  const closePortCard = () => {
    setSelectedPortId(null);
  };

  const handleAskAI = (prefill: string, portName: string) => {
    setChatPrefill(prefill);
    setChatContextPort(portName);
    setIsChatOpen(true);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black/90 text-white">
      <div className="fixed inset-0 h-[100dvh] w-[100dvw] overflow-hidden">
        {scriptsReady && !scriptError ? (
          <ARGlobe
            data={visualizationData}
            mode={visualizationMode}
            selected={selectedPortId}
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
        visualizationMode={visualizationMode}
        onModeChange={(mode) => {
          setVisualizationMode(mode);
          setSelectedPortId(null);
        }}
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

      <ArCopilot
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

type AccuracyFlag = PortDatum["arrivalAccuracy"];

function normalizeVisualizationData(raw: unknown): ARVisualizationData {
  const dataset = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as { ports?: unknown }).ports)
      ? (raw as { ports: unknown[] }).ports
      : null;

  if (!dataset) {
    return {
      ports: [],
      trails: [],
      bunkerSavedStats: { median: 0, p90: 1 },
    };
  }

  const parsedRows = dataset
    .map((entry, index) => parseRow(entry, index))
    .filter((row): row is ParsedRow => row !== null);

  if (parsedRows.length === 0) {
    return {
      ports: [],
      trails: [],
      bunkerSavedStats: { median: 0, p90: 1 },
    };
  }

  const portMap = new Map<string, { row: ParsedRow; count: number }>();

  for (const row of parsedRows) {
    const coords = BU_COORDINATES[row.bu];
    if (!coords) continue;

    const existing = portMap.get(row.bu);
    if (!existing) {
      portMap.set(row.bu, { row, count: 1 });
    } else {
      const existingTimestamp = existing.row.finalBtrMs ?? -Infinity;
      const incomingTimestamp = row.finalBtrMs ?? -Infinity;
      if (incomingTimestamp > existingTimestamp) {
        existing.row = row;
      }
      existing.count += 1;
    }
  }

  const ports: PortDatum[] = [];

  for (const [bu, payload] of portMap) {
    const coords = BU_COORDINATES[bu];
    if (!coords) continue;

    const { row, count } = payload;

    ports.push({
      id: bu,
      name: titleCase(bu),
      code: coords.code,
      lat: coords.lat,
      lng: coords.lng,
      arrivalAccuracy: row.arrivalAccuracy,
      assuredPortTimeRatio: clampNumber(row.assuredRatio, 0, 1, 0),
      berthTimeHours: clampNumber(row.berthTimeHours, 0, 80, 0),
      bunkerSavedUsd: clampNumber(
        row.bunkerSavedUsd,
        0,
        Number.POSITIVE_INFINITY,
        0,
      ),
      carbonAbatementTonnes: clampNumber(row.carbonAbatementTonnes, 0, 0.5, 0),
      latestVessel: row.vessel,
      latestRotation: row.rotation,
      arrivalVarianceHours: row.arrivalVarianceHours,
      waitTimeAtbBtrHours: row.waitTimeAtbBtrHours,
      sampleCount: count,
      lastUpdated: row.finalBtrMs,
    });
  }

  ports.sort((a, b) => a.name.localeCompare(b.name));

  const bunkerValues = parsedRows
    .map((row) => row.bunkerSavedUsd)
    .filter(
      (value): value is number =>
        value !== null && Number.isFinite(value) && value > 0,
    );

  const median = bunkerValues.length ? getMedian(bunkerValues) : 0;
  const p90 =
    bunkerValues.length > 1 ? getPercentile(bunkerValues, 0.9) : median || 1;

  const sortedRows = [...parsedRows].sort(
    (a, b) => (b.finalBtrMs ?? -Infinity) - (a.finalBtrMs ?? -Infinity),
  );
  const trails: ARVisualizationData["trails"] = [];
  const TRAIL_LIMIT = 120;

  for (const row of sortedRows) {
    if (trails.length >= TRAIL_LIMIT) break;
    const fromCoord = row.from ? PORT_COORDINATES[row.from] : undefined;
    const toCoord = row.to ? PORT_COORDINATES[row.to] : undefined;
    if (!fromCoord || !toCoord) continue;

    trails.push({
      id: `${row.rotation ?? row.vessel ?? row.bu}-${row.index}`,
      from: {
        code: fromCoord.code,
        name: fromCoord.name,
        lat: fromCoord.lat,
        lng: fromCoord.lng,
      },
      to: {
        code: toCoord.code,
        name: toCoord.name,
        lat: toCoord.lat,
        lng: toCoord.lng,
      },
      arrivalAccuracy: row.arrivalAccuracy,
      bunkerSavedUsd: row.bunkerSavedUsd ?? 0,
      carbonAbatementTonnes: clampNumber(row.carbonAbatementTonnes, 0, 0.5, 0),
    });
  }

  return {
    ports,
    trails,
    bunkerSavedStats: {
      median,
      p90: p90 || 1,
    },
  };
}

type ParsedRow = {
  index: number;
  bu: string;
  vessel: string | null;
  rotation: string | null;
  from: string | null;
  to: string | null;
  arrivalAccuracy: AccuracyFlag;
  assuredRatio: number | null;
  berthTimeHours: number | null;
  bunkerSavedUsd: number | null;
  carbonAbatementTonnes: number | null;
  arrivalVarianceHours: number | null;
  waitTimeAtbBtrHours: number | null;
  finalBtrMs: number | null;
};

function parseRow(entry: unknown, index: number): ParsedRow | null {
  if (!entry || typeof entry !== "object") return null;

  const row = entry as Record<string, unknown>;

  const bu = valueToString(row.BU, { uppercase: true });
  if (!bu) return null;

  return {
    index,
    bu,
    vessel: valueToString(row.Vessel),
    rotation: valueToString(row["Rotation No."], { uppercase: true }),
    from: valueToString(row.From, { uppercase: true }),
    to: valueToString(row.To, { uppercase: true }),
    arrivalAccuracy: parseAccuracy(row["Arrival Accuracy (Final BTR)"]),
    assuredRatio: parseNumber(row["Assured Port Time Achieved (%)"]),
    berthTimeHours: parseNumber(row["Berth Time (hours): ATU - ATB"]),
    bunkerSavedUsd: parseNumber(row["Bunker Saved (USD)"]),
    carbonAbatementTonnes: parseNumber(row["Carbon Abatement (Tonnes)"]),
    arrivalVarianceHours: parseNumber(
      row["Arrival Variance (within 4h target)"],
    ),
    waitTimeAtbBtrHours: parseNumber(row["Wait Time (Hours): ATB-BTR"]),
    finalBtrMs: parseDateTime(row["Final BTR (Local Time)"]),
  };
}

function valueToString(
  value: unknown,
  options?: { uppercase?: boolean },
): string | null {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  if (!str) return null;
  return options?.uppercase ? str.toUpperCase() : str;
}

function parseAccuracy(value: unknown): AccuracyFlag {
  const str = valueToString(value, { uppercase: true });
  if (!str) return null;
  if (str === "Y") return "Y";
  if (str === "N") return "N";
  return null;
}

function parseNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").trim();
    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function parseDateTime(value: unknown): number | null {
  const str = valueToString(value);
  if (!str) return null;

  const [datePart, timePart] = str.split(" ");
  if (!datePart) return null;
  const segments = datePart.split("-");
  if (segments.length !== 3) return null;
  const [yy, mm, dd] = segments.map((segment) => Number(segment));
  if ([yy, mm, dd].some((part) => Number.isNaN(part))) return null;

  const year = 2000 + yy;
  const month = mm - 1;
  const [hourStr, minuteStr] = (timePart ?? "00:00").split(":");
  const hour = Number(hourStr ?? "0");
  const minute = Number(minuteStr ?? "0");

  const date = new Date(Date.UTC(year, month, dd, hour, minute));
  const timestamp = date.getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
}

function clampNumber(
  value: number | null,
  min: number,
  max: number,
  fallback: number,
) {
  if (value === null || Number.isNaN(value)) return fallback;
  return Math.min(Math.max(value, min), max);
}

function titleCase(input: string) {
  return input
    .toLowerCase()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getMedian(values: number[]) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}

function getPercentile(values: number[], percentile: number) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (sorted.length - 1) * percentile;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) {
    return sorted[lower];
  }
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}
