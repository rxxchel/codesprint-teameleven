# PSA Network Map - Setup Guide

An interactive global map visualization of PSA's 9 terminals showing real-time performance metrics.

## 🗺️ Features

- **Interactive Mapbox GL map** with color-coded terminal markers
- **Multiple performance metrics**: Port Time Savings, Bunker Savings, Carbon Abatement, Arrival Accuracy, Port Calls, Average Berth Time
- **Click markers** for detailed terminal performance breakdown
- **Visual indicators**: Color gradient (green=good, red=poor) and marker sizing (larger=higher value)
- **Responsive layout** with left sidebar controls
- **Real-time metric switching** without page reload

## 📍 Terminals Covered

The map visualizes 9 PSA terminals across 3 regions:

### Asia-Pacific
- 🇸🇬 **Singapore** (1.290°N, 103.852°E)
- 🇰🇷 **Busan, South Korea** (35.104°N, 129.042°E)
- 🇮🇩 **Jakarta, Indonesia** (-6.097°S, 106.891°E)
- 🇹🇭 **Laem Chabang, Thailand** (13.081°N, 100.883°E)
- 🇮🇳 **Mumbai, India** (18.962°N, 72.820°E)
- 🇹🇼 **Kaohsiung, Taiwan** (22.619°N, 120.291°E)

### Europe
- 🇧🇪 **Antwerp, Belgium** (51.283°N, 4.401°E)
- 🇮🇹 **Genoa, Italy** (44.406°N, 8.946°E)

### Middle East
- 🇸🇦 **Dammam, Saudi Arabia** (26.408°N, 50.071°E)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

This will install:
- `mapbox-gl@3.15.0` - Core Mapbox GL JS library
- `react-map-gl@7.1.9` - React wrapper for Mapbox GL

### 2. Get a Mapbox Token

1. Sign up at https://www.mapbox.com/ (free tier available)
2. Go to https://account.mapbox.com/access-tokens/
3. Copy your default public token (starts with `pk.`)

### 3. Configure Environment Variables

Create or update your `.env.local` file:

```bash
# Mapbox GL for Network Map
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your-mapbox-token-here
```

**Note:** Replace `pk.your-mapbox-token-here` with your actual Mapbox token.

### 4. Run the Application

```bash
pnpm dev
```

### 5. Access the Network Map

Navigate to: **http://localhost:3000/network-map**

## 📊 Available Metrics

Users can visualize 6 different performance metrics:

### 1. Port Time Savings (%)
- **Definition**: Efficiency improvement vs baseline processing time
- **Color Scale**: Green (high) → Red (low)
- **Range**: 12.4% - 19.3%

### 2. Bunker Savings (USD)
- **Definition**: Fuel cost savings
- **Color Scale**: Green (high) → Red (low)
- **Range**: $890K - $1,250K

### 3. Carbon Abatement (tonnes)
- **Definition**: CO2 emissions prevented
- **Color Scale**: Green (high) → Red (low)
- **Range**: 10.5K - 15.2K tonnes

### 4. Arrival Accuracy (%)
- **Definition**: Vessels arriving within predicted window
- **Color Scale**: Green (high) → Red (low)
- **Range**: 75% - 89%

### 5. Port Calls (count)
- **Definition**: Number of vessel visits
- **Color Scale**: Green (high) → Red (low)
- **Range**: 62 - 92 calls

### 6. Average Berth Time (hours)
- **Definition**: Time ships spend in port
- **Color Scale**: Green (low) → Red (high)
- **Range**: 11.2h - 18.7h

**Note:** For Average Berth Time, lower values are better (green), so the scale is reversed.

## 🎨 User Interface

### Left Sidebar
- **Metric Selector** - Radio buttons to switch between metrics
- **Selected Terminal Info** - Details when a marker is clicked
- **About Section** - Quick guide

### Map View
- **Interactive Markers** - Color-coded circles representing terminals
- **Zoom Controls** - Pan, zoom in/out, reset bearing
- **Legend** - Shows metric scale with gradient bar

### Popup (on marker click)
- **Terminal Name** and location
- **Selected Metric** value (large)
- **All Metrics** summary (compact)

## 🔧 Customization

### Changing Terminal Data

Edit `src/lib/psa-terminals-data.ts`:

```typescript
export const PSA_TERMINALS: PSATerminal[] = [
  {
    id: "SINGAPORE",
    name: "PSA Singapore",
    lat: 1.290270,
    lng: 103.851959,
    country: "Singapore",
    region: "Asia",
    // Update metric values here
    port_time_savings_pct: 18.5,
    bunker_saved_usd: 1250000,
    carbon_abatement_tonnes: 15200,
    arrival_accuracy_pct: 82,
    calls_made: 85,
    avg_berth_time_hours: 14.2,
  },
  // ... more terminals
];
```

### Adding a New Metric

1. **Update Type Definition** in `src/lib/psa-terminals-data.ts`:
   ```typescript
   export type PSATerminal = {
     // existing fields...
     new_metric: number;
   };
   ```

2. **Add Metric Configuration**:
   ```typescript
   export const METRICS: MetricConfig[] = [
     // existing metrics...
     {
       key: "new_metric",
       label: "New Metric",
       description: "Description of what this metric measures",
       unit: "units",
       format: (value: number) => `${value.toFixed(1)} units`,
     },
   ];
   ```

3. **Update Terminal Data** with values for the new metric

### Changing Map Style

In `src/components/network-map/psa-network-map.tsx`:

```typescript
const MAP_STYLE = "mapbox://styles/mapbox/dark-v11";
// Options: light-v11, dark-v11, streets-v12, outdoors-v12, satellite-v9
```

### Customizing Colors

In `src/components/network-map/psa-network-map.tsx`:

```typescript
const START_COLOR = { r: 0, g: 200, b: 83 }; // Green
const END_COLOR = { r: 255, g: 61, b: 0 }; // Red
```

### Adjusting Marker Sizes

```typescript
function calculateMarkerSize(value: number, min: number, max: number): number {
  if (min === max) return 12;
  const ratio = (value - min) / (max - min);
  return 8 + ratio * 12; // Size between 8px and 20px (adjust as needed)
}
```

## 📁 File Structure

```
src/
├── components/
│   └── network-map/
│       ├── psa-network-map.tsx      # Main map component (289 lines)
│       └── map-controls.tsx         # Metric selector UI (44 lines)
├── app/
│   └── network-map/
│       └── page.tsx                 # Route page (62 lines)
└── lib/
    └── psa-terminals-data.ts        # Terminal data & config (243 lines)

docs/
└── network-map/
    ├── SETUP.md                     # This file
    ├── NETWORK_MAP_README.md        # Detailed feature docs
    └── NETWORK_MAP_INTEGRATION_SUMMARY.md  # Integration notes
```

## 🐛 Troubleshooting

### Map Not Loading

**Symptom**: Page shows "Mapbox token not configured"

**Solution**:
1. Verify `NEXT_PUBLIC_MAPBOX_TOKEN` is in your `.env` or `.env.local`
2. Ensure the token starts with `pk.`
3. Restart the dev server after adding the token

**For Production (Docker)**:
```bash
# Add to docker/.env
echo 'NEXT_PUBLIC_MAPBOX_TOKEN=pk.your-token' >> docker/.env

# Rebuild with --build flag to bake token into build
docker compose up -d --build
```

### Markers Not Appearing

**Symptom**: Map loads but no markers visible

**Check**:
1. Browser console for errors
2. Verify coordinates are valid (lat: -90 to 90, lng: -180 to 180)
3. Check `PSA_TERMINALS` array has data in `src/lib/psa-terminals-data.ts`
4. Verify Mapbox token is valid

### TypeScript Errors

If you see TypeScript compilation errors:

```bash
# Check types
pnpm check-types

# Rebuild if needed
pnpm build
```

### Map Rendering Issues

**Symptom**: Map is blank or distorted

**Solutions**:
1. **Import Mapbox CSS** - Ensure `mapbox-gl/dist/mapbox-gl.css` is imported in the component
2. **Container Height** - Verify the map container has explicit height (e.g., `h-full` or `height: 100%`)
3. **Token Validity** - Check if token has expired or has restrictions

## 🌐 Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (requires WebGL)
- **Mobile**: Responsive, touch gestures supported

## 🔒 Security Best Practices

### Environment Variables
- ✅ Use `NEXT_PUBLIC_*` prefix for client-side variables
- ✅ Never commit `.env` files
- ✅ Use different tokens for dev/staging/prod

### Mapbox Token
- ✅ Public tokens (pk.*) are safe for client-side use
- ✅ Restrict token to specific URLs in Mapbox dashboard
- ✅ Set usage limits to prevent abuse

## 📚 Data Notes

### Current Implementation
- **Simulated Data**: The current implementation uses hardcoded terminal data with realistic metrics
- **Static Values**: Metrics don't update in real-time

### Future Enhancements
For production use, you may want to:
1. **Connect to Database**: Replace static data with real database queries
2. **Real-time Updates**: Implement WebSocket or polling for live metrics
3. **Historical Data**: Add time range selector for trend analysis
4. **Filtering**: Add filters for regions, metric ranges, etc.
5. **Export**: Enable downloading data as CSV/Excel

## 🎯 Best Practices

### Performance
- Use lazy loading for map component
- Optimize marker rendering for large datasets
- Implement clustering for many terminals (100+)

### UX
- Provide clear metric descriptions
- Use consistent color schemes across the app
- Add loading states for async operations
- Include error boundaries for graceful failures

### Accessibility
- Ensure sufficient color contrast
- Provide keyboard navigation
- Add ARIA labels for screen readers
- Include text alternatives for visual data

## 📖 Additional Resources

- **Mapbox GL JS Docs**: https://docs.mapbox.com/mapbox-gl-js/
- **react-map-gl Docs**: https://visgl.github.io/react-map-gl/
- **Terminal Data Reference**: `src/lib/psa-terminals-data.ts`
- **Integration Summary**: `docs/network-map/NETWORK_MAP_INTEGRATION_SUMMARY.md`

## 🎓 Demo Tips

For presentations or demos:

1. **Start with Overview**: Show the global view with all terminals
2. **Switch Metrics**: Demonstrate how colors/sizes change dynamically
3. **Click a Terminal**: Show the detailed popup with all metrics
4. **Compare Terminals**: Click Singapore (usually best) vs another terminal
5. **Explain Business Value**: Relate colors to operational efficiency

## ⚙️ Technical Stack

- **Next.js 15.3.2** - React framework
- **Mapbox GL JS 3.15.0** - WebGL-powered maps
- **react-map-gl 7.1.9** - React wrapper for Mapbox
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## 🤝 Contributing

To improve the network map:

1. Update terminal coordinates if locations change
2. Add new metrics as they become available
3. Enhance visualizations (heatmaps, routes, etc.)
4. Improve mobile responsiveness
5. Add unit tests for data calculations

## 📄 License

Part of the PSA Codesprint 2025 - Problem Statement 2 project.

---

**Last Updated:** October 2025
**Version:** 1.0
**Maintained by:** Team Eleven
