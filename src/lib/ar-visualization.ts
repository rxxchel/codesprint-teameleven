export enum VisualizationMode {
  GLOBAL_PERF_HEATMAP = "GLOBAL_PERF_HEATMAP",
  SUSTAINABILITY_OVERLAY = "SUSTAINABILITY_OVERLAY",
  VESSEL_TRAILS = "VESSEL_TRAILS",
}

export const VISUALIZATION_MODE_LABELS: Record<VisualizationMode, string> = {
  [VisualizationMode.GLOBAL_PERF_HEATMAP]: "Global Performance Heatmap",
  [VisualizationMode.SUSTAINABILITY_OVERLAY]: "Sustainability Overlay",
  [VisualizationMode.VESSEL_TRAILS]: "Vessel Journey Trails",
};

export const VISUALIZATION_MODE_OPTIONS = (
  Object.entries(VISUALIZATION_MODE_LABELS) as Array<
    [VisualizationMode, string]
  >
).map(([value, label]) => ({
  value,
  label,
}));
