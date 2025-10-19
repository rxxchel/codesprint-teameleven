# PSA Network Insights Map

An interactive Mapbox GL-based visualization of PSA's 9 global terminal network, showing real-time performance metrics.

## What It Does

The Network Map provides a visual overview of PSA's global port network with:

- **Interactive Global Map**: See all 9 PSA terminals on a world map
- **Color-Coded Markers**: Markers change color based on performance (green = good, red = needs improvement)
- **Size-Based Visualization**: Marker size reflects metric magnitude
- **Click for Details**: Click any terminal to see full performance breakdown
- **Multiple Metrics**: Switch between different KPIs:
  - Port Time Savings (%)
  - Bunker Savings (USD)
  - Carbon Abatement (tonnes CO2)
  - Arrival Accuracy (%)
  - Port Calls (count)
  - Average Berth Time (hours)

## The 9 PSA Terminals

1. **Singapore** - Asia's busiest hub
2. **Busan** - South Korea
3. **Jakarta** - Indonesia
4. **Antwerp** - Belgium (Europe)
5. **Laem Chabang** - Thailand
6. **Dammam** - Saudi Arabia
7. **Mumbai** - India
8. **Genoa** - Italy (Europe)
9. **Kaohsiung** - Taiwan

## Accessing the Map

**URL**: http://localhost:3000/network-map

Or navigate to it from the FishAI UI.

## Setup Requirements

### 1. Get a Mapbox Token

1. Sign up at https://www.mapbox.com/ (free tier available)
2. Go to https://account.mapbox.com/access-tokens/
3. Create a new token or copy your default public token
4. It should start with `pk.`

### 2. Configure Environment Variable

Add your token to `/docker/.env`:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your-actual-mapbox-token-here
```

**Important**: Replace the placeholder token with your real Mapbox token!

### 3. Restart Docker

```bash
docker compose -f docker/compose.yml restart fishai
```

## Data Source

The map currently uses **simulated data** for demonstration purposes. The coordinates are real, but the performance metrics are generated to showcase the visualization.

For production use, you would:
1. Connect to your actual PSA database
2. Fetch real-time terminal performance data
3. Update the `PSA_TERMINALS` array in `src/lib/psa-terminals-data.ts`

## Features

### Visual Indicators

- **Color**: Green (good performance) → Red (poor performance)
- **Size**: Larger markers indicate higher metric values
- **Legend**: Bottom-left shows the metric scale

### Interactive Elements

- **Pan/Zoom**: Drag to pan, scroll to zoom
- **Click Markers**: See detailed popup with all metrics
- **Metric Selector**: Left sidebar - choose which KPI to visualize
- **Navigation Controls**: Top-right zoom controls

### Responsive Design

- Works on desktop and tablet sizes
- Left sidebar with controls
- Full-screen map view

## Technical Stack

- **Mapbox GL**: High-performance WebGL map rendering
- **react-map-gl**: React wrapper for Mapbox
- **Next.js 15**: Server and client components
- **TypeScript**: Type-safe data and components

## Files Created

```
src/
├── lib/
│   └── psa-terminals-data.ts         # Terminal data and types
├── components/
│   └── network-map/
│       ├── psa-network-map.tsx       # Main map component
│       └── map-controls.tsx          # Metric selector UI
└── app/
    └── network-map/
        └── page.tsx                  # Route page
```

## Customization

### Changing Terminal Data

Edit `src/lib/psa-terminals-data.ts`:

```typescript
{
  id: "SINGAPORE",
  name: "PSA Singapore",
  lat: 1.290270,
  lng: 103.851959,
  // ... update metrics here
}
```

### Adding New Metrics

1. Add the metric to the `PSATerminal` type
2. Add configuration to the `METRICS` array
3. The UI will automatically show the new option

### Changing Colors

Edit the color constants in `psa-network-map.tsx`:

```typescript
const START_COLOR = { r: 0, g: 200, b: 83 }; // Green
const END_COLOR = { r: 255, g: 61, b: 0 }; // Red
```

### Changing Map Style

Edit `MAP_STYLE` in `psa-network-map.tsx`:

```typescript
// Options: light-v11, dark-v11, streets-v12, outdoors-v12, satellite-v9
const MAP_STYLE = "mapbox://styles/mapbox/dark-v11";
```

## Demo Scenarios

### For Hackathon Presentation:

1. **Start with Port Time Savings**
   - "Here you can see which terminals are most efficient"
   - Click Singapore (largest, greenest marker)

2. **Switch to Carbon Abatement**
   - "PSA is committed to environmental sustainability"
   - Show the color changes reflecting carbon reduction

3. **Click Multiple Terminals**
   - Compare Singapore vs Mumbai
   - Show the detailed popup metrics

4. **Explain the Legend**
   - Point out the color gradient
   - Explain higher/lower value meanings

## Troubleshooting

### Map Not Loading

**Error**: "Mapbox token not configured"
- **Solution**: Add valid `NEXT_PUBLIC_MAPBOX_TOKEN` to `docker/.env` and restart

**Error**: Blank map
- **Solution**: Check browser console for errors, verify token is valid

### Markers Not Appearing

- Check that `PSA_TERMINALS` data has valid lat/lng values
- Ensure coordinates are in the correct range (lat: -90 to 90, lng: -180 to 180)

### Performance Issues

- Mapbox GL uses WebGL, ensure browser supports it
- Try switching to a lighter map style
- Reduce the number of terminals if needed

## Future Enhancements

Possible improvements for production:

1. **Real-Time Data**: Connect to live PSA database
2. **Time Range Selector**: View historical performance
3. **Vessel Tracking**: Show current vessel positions
4. **Route Visualization**: Draw lines between connected ports
5. **Heatmaps**: Show density of port calls
6. **Export**: Download map as image or data as CSV
7. **Comparison Mode**: Compare two terminals side-by-side
8. **Mobile Support**: Responsive design for phones

## Integration with Chatbot

You can reference this map in your chatbot conversations:

- "Check out the network map at /network-map"
- "Visit /network-map to see a visual comparison"
- The AI can explain what the map shows

For full integration, you could:
- Add an MCP tool that generates map URLs with specific parameters
- Have the chatbot suggest the map when users ask comparative questions
- Link specific terminals in chat responses

## Credits

- Map component adapted from codesprint-ui global-insights-map artifact
- PSA terminal data based on PSA Network Insights dashboard
- Built for PSA Codesprint Hackathon 2025 - Problem Statement 2

## Support

For issues or questions about the map feature:
1. Check this README
2. Review the code comments in the source files
3. Verify your Mapbox token is valid and has the necessary permissions

Enjoy exploring the PSA global terminal network! 🌍🚢
