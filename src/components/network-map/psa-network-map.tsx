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

function calculateMarkerSize(value: number, min: number, max: number): number {
  if (min === max) return 12;

  const ratio = (value - min) / (max - min);
  return 8 + ratio * 12; // Size between 8px and 20px
}

type PSANetworkMapProps = {
  selectedMetric: MetricKey;
  onTerminalClick?: (terminal: PSATerminal) => void;
};

export function PSANetworkMap({
  selectedMetric,
  onTerminalClick,
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
                className="cursor-pointer transition-transform hover:scale-110"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  borderRadius: "50%",
                  border: "2px solid white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
                title={terminal.name}
              />
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
              </div>
            </div>
          </Popup>
        )}
      </MapGL>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h4 className="font-semibold text-sm mb-2">{metricInfo?.label}</h4>
        <p className="text-xs text-gray-600 mb-3">{metricInfo?.description}</p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">
            {metricInfo?.format(min)}
          </span>
          <div
            className="flex-1 mx-2 h-3 rounded"
            style={{
              background: isHigherBetter
                ? `linear-gradient(to right, rgb(${END_COLOR.r}, ${END_COLOR.g}, ${END_COLOR.b}), rgb(${START_COLOR.r}, ${START_COLOR.g}, ${START_COLOR.b}))`
                : `linear-gradient(to right, rgb(${START_COLOR.r}, ${START_COLOR.g}, ${START_COLOR.b}), rgb(${END_COLOR.r}, ${END_COLOR.g}, ${END_COLOR.b}))`,
            }}
          />
          <span className="text-xs text-gray-500">
            {metricInfo?.format(max)}
          </span>
        </div>
        <p className="text-xs text-gray-500 text-center">
          {isHigherBetter ? "Lower → Higher" : "Higher → Lower"}
        </p>
      </div>
    </div>
  );
}
