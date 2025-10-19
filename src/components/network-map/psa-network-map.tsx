"use client";

import { useCallback, useMemo, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL, {
  Marker,
  NavigationControl,
  Popup,
  type ViewState,
} from "react-map-gl";
import {
  PSA_TERMINALS,
  type PSATerminal,
  type MetricKey,
  METRICS,
  getMetricRange,
} from "@/lib/psa-terminals-data";

const MAP_STYLE = "mapbox://styles/mapbox/light-v11";
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

const DEFAULT_VIEW_STATE: ViewState = {
  longitude: 80,
  latitude: 20,
  zoom: 2,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
};

// Enhanced marker size calculation for better visibility
function calculateMarkerSize(value: number, min: number, max: number): number {
  if (min === max) return 14;

  const ratio = (value - min) / (max - min);
  return 10 + ratio * 16; // Size between 10px and 26px (increased from 8-20px)
}

// Color gradient from green (good) to red (varies by metric)
const START_COLOR = { r: 0, g: 200, b: 83 }; // Green
const END_COLOR = { r: 255, g: 61, b: 0 }; // Red

function interpolateColor(
  value: number,
  min: number,
  max: number,
  reverseScale: boolean = false,
): string {
  if (min === max) {
    return "rgba(0, 200, 83, 0.85)";
  }

  let ratio = (value - min) / (max - min);

  // For some metrics, higher is better (reverse the scale)
  if (reverseScale) {
    ratio = 1 - ratio;
  }

  const r = Math.round(START_COLOR.r + (END_COLOR.r - START_COLOR.r) * ratio);
  const g = Math.round(START_COLOR.g + (END_COLOR.g - START_COLOR.g) * ratio);
  const b = Math.round(START_COLOR.b + (END_COLOR.b - START_COLOR.b) * ratio);

  return `rgba(${r}, ${g}, ${b}, 0.85)`;
}

type PSANetworkMapProps = {
  selectedMetric: MetricKey;
  onTerminalClick?: (terminal: PSATerminal) => void;
  onAskAI?: (terminal: PSATerminal) => void;
};

export function PSANetworkMap({
  selectedMetric,
  onTerminalClick,
  onAskAI,
}: PSANetworkMapProps) {
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_VIEW_STATE);
  const [selectedTerminal, setSelectedTerminal] = useState<PSATerminal | null>(
    null,
  );

  const { min, max } = useMemo(
    () => getMetricRange(selectedMetric),
    [selectedMetric],
  );

  // Determine if higher values are better (green) or worse (red)
  const isHigherBetter = [
    "port_time_savings_pct",
    "bunker_saved_usd",
    "carbon_abatement_tonnes",
    "arrival_accuracy_pct",
    "calls_made",
  ].includes(selectedMetric);

  const handleMarkerClick = useCallback(
    (terminal: PSATerminal) => {
      setSelectedTerminal(terminal);
      onTerminalClick?.(terminal);
      // Open chat sidebar directly when clicking marker
      onAskAI?.(terminal);
    },
    [onTerminalClick, onAskAI],
  );

  const handleClosePopup = useCallback(() => {
    setSelectedTerminal(null);
  }, []);

  const metricInfo = METRICS.find((m) => m.key === selectedMetric);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            Mapbox token not configured
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please add NEXT_PUBLIC_MAPBOX_TOKEN to your environment variables
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <MapGL
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={MAP_STYLE}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />

        {/* Render markers for each terminal */}
        {PSA_TERMINALS.map((terminal) => {
          const value = terminal[selectedMetric];
          const color = interpolateColor(value, min, max, !isHigherBetter);
          const size = calculateMarkerSize(value, min, max);

          return (
            <Marker
              key={terminal.id}
              longitude={terminal.lng}
              latitude={terminal.lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(terminal);
              }}
            >
              <div className="relative">
                {/* Pulsing outer ring for selected terminal */}
                {selectedTerminal?.id === terminal.id && (
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{
                      width: `${size + 12}px`,
                      height: `${size + 12}px`,
                      backgroundColor: color,
                      opacity: 0.3,
                      transform: "translate(-6px, -6px)",
                    }}
                  />
                )}

                {/* Main marker */}
                <div
                  className="cursor-pointer transition-all duration-300 ease-out hover:scale-125 group relative z-10"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    borderRadius: "50%",
                    border: "3px solid white",
                    boxShadow:
                      selectedTerminal?.id === terminal.id
                        ? "0 0 0 4px rgba(59, 130, 246, 0.5), 0 6px 20px rgba(0,0,0,0.4), 0 0 30px rgba(59, 130, 246, 0.3)"
                        : "0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
                  }}
                  title={terminal.name}
                >
                  {/* Inner glow */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%)`,
                    }}
                  />

                  {/* Hover ring effect */}
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{
                      boxShadow:
                        "0 0 0 6px rgba(255,255,255,0.6), 0 0 30px rgba(0,0,0,0.4)",
                      filter: "blur(1px)",
                    }}
                  />

                  {/* Hover glow effect */}
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      boxShadow: `0 0 20px 4px ${color}`,
                    }}
                  />
                </div>
              </div>
            </Marker>
          );
        })}

        {/* Popup when a terminal is selected */}
        {selectedTerminal && (
          <Popup
            longitude={selectedTerminal.lng}
            latitude={selectedTerminal.lat}
            anchor="top"
            onClose={handleClosePopup}
            closeButton={true}
            closeOnClick={false}
            className="terminal-popup"
          >
            <div className="p-4 min-w-[280px] bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50">
              {/* Header with gradient */}
              <div className="mb-4 pb-3 border-b border-gray-200/70">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {selectedTerminal.name}
                  </h3>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600 flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {selectedTerminal.country} • {selectedTerminal.region}
                </p>
              </div>

              {/* Featured Metric */}
              <div className="mb-4 p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">
                    {metricInfo?.label}
                  </span>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {metricInfo?.format(selectedTerminal[selectedMetric])}
                  </span>
                </div>
              </div>

              {/* All Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-gray-50/80 rounded-lg border border-gray-200/50 hover:bg-gray-100/80 transition-colors">
                  <div className="text-xs text-gray-600 mb-1">Time Savings</div>
                  <div className="font-bold text-sm text-gray-900">
                    {selectedTerminal.port_time_savings_pct.toFixed(1)}%
                  </div>
                </div>
                <div className="p-2.5 bg-gray-50/80 rounded-lg border border-gray-200/50 hover:bg-gray-100/80 transition-colors">
                  <div className="text-xs text-gray-600 mb-1">Bunker Saved</div>
                  <div className="font-bold text-sm text-gray-900">
                    ${(selectedTerminal.bunker_saved_usd / 1000).toFixed(0)}K
                  </div>
                </div>
                <div className="p-2.5 bg-gray-50/80 rounded-lg border border-gray-200/50 hover:bg-gray-100/80 transition-colors">
                  <div className="text-xs text-gray-600 mb-1">CO₂ Abated</div>
                  <div className="font-bold text-sm text-gray-900">
                    {(selectedTerminal.carbon_abatement_tonnes / 1000).toFixed(
                      1,
                    )}
                    K
                  </div>
                </div>
                <div className="p-2.5 bg-gray-50/80 rounded-lg border border-gray-200/50 hover:bg-gray-100/80 transition-colors">
                  <div className="text-xs text-gray-600 mb-1">Accuracy</div>
                  <div className="font-bold text-sm text-gray-900">
                    {selectedTerminal.arrival_accuracy_pct}%
                  </div>
                </div>
                <div className="p-2.5 bg-gray-50/80 rounded-lg border border-gray-200/50 hover:bg-gray-100/80 transition-colors">
                  <div className="text-xs text-gray-600 mb-1">Port Calls</div>
                  <div className="font-bold text-sm text-gray-900">
                    {selectedTerminal.calls_made}
                  </div>
                </div>
                <div className="p-2.5 bg-gray-50/80 rounded-lg border border-gray-200/50 hover:bg-gray-100/80 transition-colors">
                  <div className="text-xs text-gray-600 mb-1">Berth Time</div>
                  <div className="font-bold text-sm text-gray-900">
                    {selectedTerminal.avg_berth_time_hours.toFixed(1)}h
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </MapGL>

      {/* Legend with Enhanced Glassmorphism */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-6 max-w-sm transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] group">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-7 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
          <h4 className="font-bold text-base bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {metricInfo?.label}
          </h4>
        </div>

        <p className="text-xs text-gray-600 mb-5 leading-relaxed pl-3">
          {metricInfo?.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
            <span className="px-3 py-1.5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-sm border border-gray-200/50">
              {metricInfo?.format(min)}
            </span>
            <span className="px-3 py-1.5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-sm border border-gray-200/50">
              {metricInfo?.format(max)}
            </span>
          </div>

          <div className="relative">
            <div
              className="h-5 rounded-full shadow-lg relative overflow-hidden ring-1 ring-gray-200/50"
              style={{
                background: isHigherBetter
                  ? `linear-gradient(to right, rgb(${END_COLOR.r}, ${END_COLOR.g}, ${END_COLOR.b}), rgb(${START_COLOR.r}, ${START_COLOR.g}, ${START_COLOR.b}))`
                  : `linear-gradient(to right, rgb(${START_COLOR.r}, ${START_COLOR.g}, ${START_COLOR.b}), rgb(${END_COLOR.r}, ${END_COLOR.g}, ${END_COLOR.b}))`,
              }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>

              {/* Inner highlight */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <svg
              className="w-3 h-3 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <p className="text-xs text-gray-600 font-semibold">
              {isHigherBetter
                ? "Lower → Higher (Better)"
                : "Higher (Better) → Lower"}
            </p>
            <svg
              className="w-3 h-3 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
