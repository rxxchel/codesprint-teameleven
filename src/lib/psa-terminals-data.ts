/**
 * PSA Network Terminal Data
 * Real coordinates and simulated performance metrics for 9 PSA terminals
 */

export type PSATerminal = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country: string;
  region: string;
  // Performance metrics
  port_time_savings_pct: number; // Percentage improvement vs baseline
  bunker_saved_usd: number; // USD saved on fuel
  carbon_abatement_tonnes: number; // CO2 tonnes prevented
  arrival_accuracy_pct: number; // % of ships arriving on time
  calls_made: number; // Number of vessel visits
  avg_berth_time_hours: number; // Average time ships spend in port
};

/**
 * The 9 PSA terminals from the Power BI dashboard
 * Coordinates are real, metrics are simulated for demo purposes
 */
export const PSA_TERMINALS: PSATerminal[] = [
  {
    id: "SINGAPORE",
    name: "PSA Singapore",
    lat: 1.29027,
    lng: 103.851959,
    country: "Singapore",
    region: "Asia",
    port_time_savings_pct: 18.5,
    bunker_saved_usd: 417940,
    carbon_abatement_tonnes: 15200,
    arrival_accuracy_pct: 82,
    calls_made: 85,
    avg_berth_time_hours: 14.2,
  },
  {
    id: "BUSAN",
    name: "PSA Busan",
    lat: 35.104,
    lng: 129.042,
    country: "South Korea",
    region: "Asia",
    port_time_savings_pct: 16.2,
    bunker_saved_usd: 890000,
    carbon_abatement_tonnes: 10800,
    arrival_accuracy_pct: 79,
    calls_made: 62,
    avg_berth_time_hours: 15.8,
  },
  {
    id: "JAKARTA",
    name: "PSA Jakarta",
    lat: -6.097,
    lng: 106.891,
    country: "Indonesia",
    region: "Asia",
    port_time_savings_pct: 19,
    bunker_saved_usd: 506410,
    carbon_abatement_tonnes: 5290,
    arrival_accuracy_pct: 100,
    calls_made: 32,
    avg_berth_time_hours: 16.5,
  },
  {
    id: "ANTWERP",
    name: "PSA Antwerp",
    lat: 51.283,
    lng: 4.401,
    country: "Belgium",
    region: "Europe",
    port_time_savings_pct: 19.3,
    bunker_saved_usd: 1100000,
    carbon_abatement_tonnes: 13500,
    arrival_accuracy_pct: 84,
    calls_made: 58,
    avg_berth_time_hours: 13.7,
  },
  {
    id: "LAEM_CHABANG",
    name: "PSA Laem Chabang",
    lat: 13.081,
    lng: 100.883,
    country: "Thailand",
    region: "Asia",
    port_time_savings_pct: 13.8,
    bunker_saved_usd: 650000,
    carbon_abatement_tonnes: 7800,
    arrival_accuracy_pct: 72,
    calls_made: 42,
    avg_berth_time_hours: 17.1,
  },
  {
    id: "DAMMAM",
    name: "PSA Dammam",
    lat: 26.408,
    lng: 50.071,
    country: "Saudi Arabia",
    region: "Middle East",
    port_time_savings_pct: 15.6,
    bunker_saved_usd: 780000,
    carbon_abatement_tonnes: 9400,
    arrival_accuracy_pct: 77,
    calls_made: 38,
    avg_berth_time_hours: 15.3,
  },
  {
    id: "MUMBAI",
    name: "PSA Mumbai",
    lat: 18.962,
    lng: 72.82,
    country: "India",
    region: "Asia",
    port_time_savings_pct: 12.4,
    bunker_saved_usd: 590000,
    carbon_abatement_tonnes: 7100,
    arrival_accuracy_pct: 70,
    calls_made: 35,
    avg_berth_time_hours: 18.2,
  },
  {
    id: "TIANJIN",
    name: "PSA Tianjin",
    lat: 39.084,
    lng: 117.2,
    country: "China",
    region: "Asia",
    port_time_savings_pct: 15.8,
    bunker_saved_usd: 810000,
    carbon_abatement_tonnes: 9800,
    arrival_accuracy_pct: 78,
    calls_made: 52,
    avg_berth_time_hours: 15.6,
  },
  {
    id: "PANAMA_CITY",
    name: "PSA Panama City",
    lat: 8.968,
    lng: -79.534,
    country: "Panama",
    region: "Americas",
    port_time_savings_pct: 13.2,
    bunker_saved_usd: 680000,
    carbon_abatement_tonnes: 8200,
    arrival_accuracy_pct: 74,
    calls_made: 44,
    avg_berth_time_hours: 16.8,
  },
];

/**
 * Available metrics that can be visualized on the map
 */
export type MetricKey = keyof Pick<
  PSATerminal,
  | "port_time_savings_pct"
  | "bunker_saved_usd"
  | "carbon_abatement_tonnes"
  | "arrival_accuracy_pct"
  | "calls_made"
  | "avg_berth_time_hours"
>;

export const METRICS: Array<{
  key: MetricKey;
  label: string;
  description: string;
  unit: string;
  format: (value: number) => string;
}> = [
  {
    key: "port_time_savings_pct",
    label: "Port Time Savings",
    description: "Percentage improvement vs baseline processing time",
    unit: "%",
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "bunker_saved_usd",
    label: "Bunker Savings",
    description: "Fuel cost savings in USD",
    unit: "USD",
    format: (v) => `$${(v / 1000).toFixed(0)}K`,
  },
  {
    key: "carbon_abatement_tonnes",
    label: "Carbon Abatement",
    description: "CO2 emissions prevented in tonnes",
    unit: "tonnes",
    format: (v) => `${(v / 1000).toFixed(1)}K tonnes`,
  },
  {
    key: "arrival_accuracy_pct",
    label: "Arrival Accuracy",
    description: "Percentage of vessels arriving within predicted window",
    unit: "%",
    format: (v) => `${v.toFixed(0)}%`,
  },
  {
    key: "calls_made",
    label: "Port Calls",
    description: "Number of vessel visits",
    unit: "calls",
    format: (v) => v.toFixed(0),
  },
  {
    key: "avg_berth_time_hours",
    label: "Avg Berth Time",
    description: "Average time vessels spend at berth",
    unit: "hours",
    format: (v) => `${v.toFixed(1)}h`,
  },
];

/**
 * Calculate min/max for a metric across all terminals
 */
export function getMetricRange(metric: MetricKey): {
  min: number;
  max: number;
} {
  const values = PSA_TERMINALS.map((t) => t[metric]);
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}
