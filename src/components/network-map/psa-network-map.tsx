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
    },
    [onTerminalClick],
  );

  const handleClosePopup = useCallback(() => {
    setSelectedTerminal(null);
  }, []);

  const handleAskAI = useCallback(
    (terminal: PSATerminal) => {
      onAskAI?.(terminal);
    },
    [onAskAI],
  );

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
              <div
                className="cursor-pointer transition-all duration-300 ease-out hover:scale-125 group"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  borderRadius: "50%",
                  border: "2px solid white",
                  boxShadow:
                    selectedTerminal?.id === terminal.id
                      ? "0 0 0 3px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(0,0,0,0.4)"
                      : "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.1)",
                }}
                title={terminal.name}
              >
                {/* Hover ring effect */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow:
                      "0 0 0 4px rgba(255,255,255,0.5), 0 0 20px rgba(0,0,0,0.3)",
                  }}
                />
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
            <div className="p-2 min-w-[250px]">
              <h3 className="font-bold text-lg mb-2">
                {selectedTerminal.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {selectedTerminal.country} • {selectedTerminal.region}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {metricInfo?.label}:
                  </span>
                  <span className="text-sm font-bold">
                    {metricInfo?.format(selectedTerminal[selectedMetric])}
                  </span>
                </div>

                <hr className="my-2" />

                <div className="text-xs space-y-1 text-gray-700">
                  <div className="flex justify-between">
                    <span>Port Time Savings:</span>
                    <span className="font-semibold">
                      {selectedTerminal.port_time_savings_pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bunker Saved:</span>
                    <span className="font-semibold">
                      ${(selectedTerminal.bunker_saved_usd / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbon Abatement:</span>
                    <span className="font-semibold">
                      {(
                        selectedTerminal.carbon_abatement_tonnes / 1000
                      ).toFixed(1)}
                      K tonnes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Arrival Accuracy:</span>
                    <span className="font-semibold">
                      {selectedTerminal.arrival_accuracy_pct}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Port Calls:</span>
                    <span className="font-semibold">
                      {selectedTerminal.calls_made}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Berth Time:</span>
                    <span className="font-semibold">
                      {selectedTerminal.avg_berth_time_hours.toFixed(1)}h
                    </span>
                  </div>
                </div>

                {/* Ask AI Button */}
                <button
                  onClick={() => handleAskAI(selectedTerminal)}
                  className="mt-3 w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Ask AI about this terminal
                </button>
              </div>
            </div>
          </Popup>
        )}
      </MapGL>

      {/* Legend with Glassmorphism */}
      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 p-5 max-w-xs transition-all duration-300 hover:shadow-2xl">
        <h4 className="font-bold text-sm mb-1.5 text-gray-900">
          {metricInfo?.label}
        </h4>
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          {metricInfo?.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-gray-700">
            <span className="px-2 py-1 bg-gray-100/80 rounded">
              {metricInfo?.format(min)}
            </span>
            <span className="px-2 py-1 bg-gray-100/80 rounded">
              {metricInfo?.format(max)}
            </span>
          </div>

          <div
            className="h-4 rounded-full shadow-inner relative overflow-hidden"
            style={{
              background: isHigherBetter
                ? `linear-gradient(to right, rgb(${END_COLOR.r}, ${END_COLOR.g}, ${END_COLOR.b}), rgb(${START_COLOR.r}, ${START_COLOR.g}, ${START_COLOR.b}))`
                : `linear-gradient(to right, rgb(${START_COLOR.r}, ${START_COLOR.g}, ${START_COLOR.b}), rgb(${END_COLOR.r}, ${END_COLOR.g}, ${END_COLOR.b}))`,
            }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <p className="text-xs text-gray-500 text-center font-medium pt-1">
            {isHigherBetter
              ? "Lower ← → Higher (Better)"
              : "Higher (Better) ← → Lower"}
          </p>
        </div>
      </div>
    </div>
  );
}
