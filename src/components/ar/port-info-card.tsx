"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import type { PortDatum } from "@/components/ar-globe";

type PortInfoCardProps = {
  port: PortDatum;
  onClose: () => void;
  onAskAI: (prefill: string) => void;
};

export function PortInfoCard({ port, onClose, onAskAI }: PortInfoCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const accuracyBadge = getAccuracyBadge(port.arrivalAccuracy);

  const primaryMetrics = [
    {
      label: "Assured Port Time",
      value: `${(clamp(port.assuredPortTimeRatio, 0, 1) * 100).toFixed(1)}%`,
    },
    {
      label: "Berth Time",
      value: `${port.berthTimeHours.toFixed(1)} h`,
    },
    {
      label: "Bunker Saved",
      value: formatCurrency(port.bunkerSavedUsd),
    },
    {
      label: "Carbon Abatement",
      value: `${port.carbonAbatementTonnes.toFixed(3)} t`,
    },
  ];

  const secondaryMetrics = [
    {
      label: "Arrival Variance",
      value: formatHours(port.arrivalVarianceHours),
    },
    {
      label: "Wait Time (ATB − BTR)",
      value: formatHours(port.waitTimeAtbBtrHours),
    },
  ];

  const lastUpdatedLabel = formatTimestamp(port.lastUpdated);

  const handleAsk = () => {
    const prompt = [
      `Summarize recent berth performance for ${port.name}.`,
      `arrival_accuracy=${port.arrivalAccuracy ?? "unknown"},`,
      `assured_port_time_pct=${(clamp(port.assuredPortTimeRatio, 0, 1) * 100).toFixed(1)},`,
      `berth_time_hours=${port.berthTimeHours.toFixed(1)},`,
      `wait_time_atb_btr=${formatNumber(port.waitTimeAtbBtrHours)},`,
      `arrival_variance=${formatNumber(port.arrivalVarianceHours)},`,
      `bunker_saved_usd=${port.bunkerSavedUsd.toFixed(0)},`,
      `carbon_abatement_tonnes=${port.carbonAbatementTonnes.toFixed(3)}.`,
      "Provide two improvement ideas and one risk to monitor.",
    ].join(" ");
    onAskAI(prompt);
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 100 }}
      dragElastic={0.12}
      onDragEnd={(_, info) => {
        if (info.offset.y > 60) {
          onClose();
        }
      }}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.35,
        ease: "easeOut",
      }}
      className="pointer-events-auto relative w-full max-w-xl rounded-2xl border border-white/20 bg-white/15 p-6 text-white shadow-lg backdrop-blur-xl"
    >
      <div className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-white/40" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-white">
            Port of {port.name}
          </p>
          <p className="text-sm text-white/70">
            {port.latestVessel
              ? `Latest vessel: ${port.latestVessel}`
              : "Latest vessel not reported"}
          </p>
          {port.latestRotation && (
            <p className="text-xs text-white/50">
              Rotation {port.latestRotation}
            </p>
          )}
          {lastUpdatedLabel && (
            <p className="mt-2 text-xs text-white/50">
              Updated {lastUpdatedLabel}
            </p>
          )}
        </div>

        <div
          className={`inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-medium ${accuracyBadge.textClass}`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${accuracyBadge.dotClass}`}
            aria-hidden="true"
          />
          {accuracyBadge.label}
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4">
        {primaryMetrics.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-3"
          >
            <dt className="text-xs uppercase tracking-wide text-white/60">
              {item.label}
            </dt>
            <dd className="mt-1 text-base font-semibold text-white">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <dl className="mt-4 grid grid-cols-2 gap-4">
        {secondaryMetrics.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/10 bg-black/10 px-3 py-3"
          >
            <dt className="text-[11px] uppercase tracking-wide text-white/50">
              {item.label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-white">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <Button
        type="button"
        onClick={handleAsk}
        className="mt-6 w-full rounded-full border border-white/20 bg-white/20 py-5 text-base font-semibold text-white hover:bg-white/30"
        aria-label={`Ask AI about Port of ${port.name}`}
      >
        Ask Copilot about this terminal
      </Button>
    </motion.div>
  );
}

function getAccuracyBadge(flag: PortDatum["arrivalAccuracy"]) {
  if (flag === "Y") {
    return {
      label: "On-time arrival",
      textClass: "text-emerald-200",
      dotClass: "bg-emerald-300",
    };
  }
  if (flag === "N") {
    return {
      label: "Delay risk",
      textClass: "text-rose-200",
      dotClass: "bg-rose-300",
    };
  }
  return {
    label: "Accuracy unknown",
    textClass: "text-zinc-200",
    dotClass: "bg-zinc-300",
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatCurrency(value: number) {
  if (!Number.isFinite(value) || value === 0) return "$0";
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value.toFixed(0)}`;
}

function formatHours(value: number | null) {
  if (value === null || Number.isNaN(value)) return "—";
  const rounded = value.toFixed(1);
  return `${rounded} h`;
}

function formatNumber(value: number | null) {
  if (value === null || Number.isNaN(value)) return "null";
  return value.toFixed(2);
}

function formatTimestamp(timestamp: number | null) {
  if (!timestamp) return null;
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return formatter.format(new Date(timestamp));
}

export default PortInfoCard;
