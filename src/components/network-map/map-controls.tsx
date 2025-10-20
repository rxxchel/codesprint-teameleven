"use client";

import { type MetricKey, METRICS } from "@/lib/psa-terminals-data";
import {
  TrendingUp,
  DollarSign,
  Leaf,
  Target,
  Ship,
  Clock,
} from "lucide-react";

type MapControlsProps = {
  selectedMetric: MetricKey;
  onMetricChange: (metric: MetricKey) => void;
};

// Icon mapping for each metric
const METRIC_ICONS: Record<
  MetricKey,
  React.ComponentType<{ className?: string }>
> = {
  port_time_savings_pct: TrendingUp,
  bunker_saved_usd: DollarSign,
  carbon_abatement_tonnes: Leaf,
  arrival_accuracy_pct: Target,
  calls_made: Ship,
  avg_berth_time_hours: Clock,
};

// Color schemes for each metric (dark theme)
const METRIC_COLORS: Record<
  MetricKey,
  { gradient: string; bg: string; border: string; text: string }
> = {
  port_time_savings_pct: {
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-900/30",
    border: "border-blue-500/50",
    text: "text-blue-300",
  },
  bunker_saved_usd: {
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-900/30",
    border: "border-emerald-500/50",
    text: "text-emerald-300",
  },
  carbon_abatement_tonnes: {
    gradient: "from-green-500 to-lime-500",
    bg: "bg-green-900/30",
    border: "border-green-500/50",
    text: "text-green-300",
  },
  arrival_accuracy_pct: {
    gradient: "from-purple-500 to-pink-500",
    bg: "bg-purple-900/30",
    border: "border-purple-500/50",
    text: "text-purple-300",
  },
  calls_made: {
    gradient: "from-orange-500 to-amber-500",
    bg: "bg-orange-900/30",
    border: "border-orange-500/50",
    text: "text-orange-300",
  },
  avg_berth_time_hours: {
    gradient: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-900/30",
    border: "border-indigo-500/50",
    text: "text-indigo-300",
  },
};

export function MapControls({
  selectedMetric,
  onMetricChange,
}: MapControlsProps) {
  return (
    <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
        <h3 className="font-bold text-base text-white">Select Metric</h3>
      </div>

      <div className="space-y-2.5">
        {METRICS.map((metric) => {
          const Icon = METRIC_ICONS[metric.key];
          const colors = METRIC_COLORS[metric.key];
          const isSelected = selectedMetric === metric.key;

          return (
            <label
              key={metric.key}
              className={`
                group relative flex items-start cursor-pointer p-3.5 rounded-xl transition-all duration-300
                ${
                  isSelected
                    ? `${colors.bg} border-2 ${colors.border} shadow-lg shadow-${colors.border.split("-")[1]}-500/30 scale-[1.02]`
                    : "border-2 border-transparent hover:border-gray-600 hover:bg-gray-700/50 hover:shadow-md"
                }
              `}
            >
              <input
                type="radio"
                name="metric"
                value={metric.key}
                checked={isSelected}
                onChange={(e) => onMetricChange(e.target.value as MetricKey)}
                className="sr-only"
              />

              {/* Icon with gradient background */}
              <div
                className={`
                flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-all duration-300
                ${
                  isSelected
                    ? `bg-gradient-to-br ${colors.gradient} shadow-lg`
                    : "bg-gray-700 group-hover:bg-gray-600"
                }
              `}
              >
                <Icon
                  className={`w-5 h-5 ${isSelected ? "text-white" : "text-gray-300 group-hover:text-white"}`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div
                  className={`font-semibold text-sm mb-0.5 transition-colors ${isSelected ? colors.text : "text-white"}`}
                >
                  {metric.label}
                </div>
                <div
                  className={`text-xs leading-relaxed transition-colors ${isSelected ? "text-gray-300" : "text-gray-400"}`}
                >
                  {metric.description}
                </div>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div
                    className={`w-2 h-2 rounded-full bg-gradient-to-br ${colors.gradient} animate-pulse`}
                  ></div>
                </div>
              )}
            </label>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-700/80">
        <div className="flex items-start gap-2">
          <svg
            className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xs text-gray-400 leading-relaxed">
            Click on any terminal marker to view detailed metrics and AI-powered
            insights
          </p>
        </div>
      </div>
    </div>
  );
}
