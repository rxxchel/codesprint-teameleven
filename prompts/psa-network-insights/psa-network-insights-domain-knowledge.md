# PSA Network Insights - Domain Knowledge Documentation

## Executive Overview

This document provides comprehensive domain knowledge for PSA's Network Insights dashboard, designed to support the development of AI-powered conversational interfaces for Problem Statement 2 of the PSA Codesprint Hackathon 2025.

### Purpose
Enable rapid interpretation of PSA's global trade network performance data and facilitate faster, data-driven decision-making aligned with PSA's strategic vision of a digitally integrated, sustainable, and resilient global trade ecosystem.

---

## 1. Business Context

### PSA's Global Strategy

**Vision**: Create a digitally integrated, future-ready trade ecosystem that delivers visibility, agility, and efficiency across the global supply chain.

**Strategic Pillars**:
1. **Digital Integration**: Ports, logistics hubs, and warehouses function as integrated nodes with real-time data exchange
2. **Operational Synergy**: Seamless coordination across the entire supply chain network
3. **Resilience**: Ability to navigate geopolitical disruptions, tariffs, regulatory shifts, and climate impacts
4. **Sustainability**: Green operations focused on carbon reduction and fuel efficiency
5. **Innovation**: Leveraging AI (classical optimization, generative AI, and agentic AI) for continuous improvement

### 2025 Global Trade Environment

**Challenges**:
- Geopolitical flashpoints disrupting traditional trade routes
- Escalating tariffs increasing operational costs
- Regulatory shifts requiring adaptive compliance
- Labor unrest impacting port operations
- Climate-driven disruptions (extreme weather, sea level changes)
- Supply chain fragmentation

**PSA's Response**:
The Network Insights dashboard represents PSA's data-driven approach to maintaining "faster, greener, and smarter" global trade despite these challenges.

---

## 2. Dashboard Structure

### Overview
The **Network Insights Dashboard** provides a single-pane view of PSA's global network performance, enabling users to:
- Monitor key operational and sustainability metrics
- Identify trends and patterns across time periods
- Drill down into specific liners, services, or port locations
- Make data-informed decisions quickly

### Data Coverage
- **Time Period**: January 2025 - September 2025 (9 months)
- **Geographic Scope**: Global PSA network (9 nodes/business units in current dataset)
- **Operational Scope**: 10 liner operators, 30 services, 300 port calls
- **Update Frequency**: Near real-time (based on vessel movements and operations data)

### Data Limitations & Important Notes

**Sample/Anonymized Dataset:**
This dashboard uses sample or anonymized data, particularly for hackathon and demo environments. Key implications:

1. **Dynamic Filter Contents**: The terminals, shipping lines, and services appearing in filters are determined solely by what data exists in the Power BI dataset for the selected date range. Users cannot assume any specific terminal, liner, or service will be available without checking the filters.

2. **Scrollable Filter Lists**: Many filter sections (Nodes, Services, Liners) contain more items than fit in the initially visible area. The filter pane must be scrolled to see all available options. For example, if the dashboard shows "Nodes: 9" but only 5 are immediately visible, the remaining 4 require scrolling down in the filter list.

3. **Future Date Data**: The 2025 date range indicates this is simulated/projected data rather than actual historical operational data.

4. **Anonymization**: Liner and service codes (e.g., AZQ, BLX, 03J) appear to be anonymized representations rather than actual company names and route identifiers.

**Best Practice for AI Responses:**
- Always scroll through and verify what's actually available in the dashboard filters before making statements about specific terminals
- Don't report a terminal as "unavailable" without checking the complete scrollable filter list
- If a user asks about a terminal, scroll through the full filter before confirming whether it exists in the dataset

---

## 3. Metrics Definitions

### 3.1 Network Summary Metrics (Top Cards)

#### Liners
- **Definition**: Number of unique shipping line operators utilizing PSA's network
- **Current Value**: 10
- **Business Significance**: Indicates customer diversity and network reach
- **Examples**: Major global carriers (anonymized as AZQ, BLX, CRY, DPT, EVO, etc.)

#### Services
- **Definition**: Number of active shipping services/routes operating through PSA's network
- **Current Value**: 30
- **Business Significance**: Represents connectivity breadth and route diversity
- **Examples**: Service codes like 03J, 15P, 23I, 25Y, 2C7 represent different trade lanes and routes

#### Nodes
- **Definition**: Number of PSA Business Units (ports/terminals) in the integrated network
- **Current Value**: 9 (based on available data in the current dataset)
- **Business Significance**: Scale of PSA's global footprint
- **Examples**: The available nodes depend on the Power BI dataset and may include terminals across global regions
- **Important Note**: The node count reflects the terminals with data in the selected date range. The filter list may require scrolling to see all available nodes.

#### Calls Made
- **Definition**: Total number of vessel port calls completed in the selected period
- **Current Value**: 300
- **Business Significance**: Volume indicator; higher calls = higher operational tempo
- **Calculation**: Each vessel arrival and departure at a PSA terminal counts as one call

### 3.2 Financial & Environmental Impact Metrics

#### Total Bunker Saved (USD)
- **Definition**: Cumulative financial savings from fuel (bunker) optimization across all operations
- **Current Value**: $5.55M USD (across 9 months)
- **Monthly Range**: $0.27M - $0.95M
- **Business Significance**:
  - Direct bottom-line impact
  - Demonstrates ROI of optimization initiatives
  - Reflects fuel efficiency improvements
- **Contributing Factors**:
  - Optimized vessel speed (slow steaming)
  - Reduced port waiting time
  - Better berth planning
  - Efficient cargo handling reducing engine idle time

#### Total Carbon Abatement (K tonnes)
- **Definition**: Total carbon emissions prevented through operational optimizations
- **Current Value**: 58.13K tonnes (across 9 months)
- **Monthly Range**: 3.1 - 8.6K tonnes
- **Business Significance**:
  - Environmental sustainability metric
  - Supports PSA's green operations mandate
  - Regulatory compliance (IMO 2030/2050 targets)
  - Corporate social responsibility demonstration
- **Relationship**: Directly correlates with bunker savings (less fuel = fewer emissions)

### 3.3 Performance Metrics (Visualizations)

#### Port Time Savings vs Baseline
- **Definition**: Percentage improvement in vessel port turnaround time compared to historical baseline operations
- **Display**: Monthly bar chart showing percentage improvements
- **Current Range**: 9% - 20% savings
- **Average**: ~14% across the period

**What It Measures**:
- Efficiency of berth allocation
- Speed of cargo loading/unloading
- Effectiveness of traffic orchestration
- Impact of automation and AI systems

**Business Impact**:
- Faster turnaround = more vessel capacity
- Reduced port congestion
- Improved customer satisfaction (shipping lines)
- Higher terminal throughput
- Lower operational costs

**Interpretation Guide**:
- **<10%**: Below target, investigate bottlenecks
- **10-15%**: Meeting expectations
- **15-20%**: Strong performance
- **>20%**: Exceptional, study for best practices

#### Arrival Accuracy
- **Definition**: Percentage of vessels arriving within predicted time windows
- **Display**: Dual-line chart showing accurate (Y) vs inaccurate (N) predictions
- **Current Performance**:
  - Accurate (Y): 59-82% (varies monthly)
  - Inaccurate (N): 18-41% (inverse of accurate)

**What It Measures**:
- Quality of arrival prediction models
- Reliability of scheduling systems
- Impact of external disruptions (weather, delays, port congestion elsewhere)
- Effectiveness of real-time data integration

**Business Impact**:
- Accurate predictions → better resource planning (cranes, labor, berths)
- Reduced idle time for equipment and workers
- Improved customer confidence
- Enhanced supply chain visibility for cargo owners

**Target**: Maximize accurate arrivals (green line), minimize inaccurate (red line)

**Factors Affecting Accuracy**:
- Weather conditions
- Prior port delays
- Vessel speed variations
- Canal/strait congestion
- Quality of AIS (Automatic Identification System) data

#### Bunker Savings (USD) - Monthly Trend
- **Definition**: Monthly breakdown of fuel cost savings
- **Display**: Bar chart showing monthly savings in USD
- **Peak Month**: June ($951K)
- **Lowest Month**: January ($267K)

**Pattern Analysis**:
- Shows variability across months
- Helps identify seasonal efficiency trends
- Enables month-over-month performance tracking
- Supports forecasting and budget planning

#### Carbon Abatement (K tonnes) - Monthly Trend
- **Definition**: Monthly environmental impact measurement
- **Display**: Bar chart showing monthly carbon reduction
- **Peak Month**: June (8.6K tonnes)
- **Lowest Month**: January (3.1K tonnes)

**Pattern Analysis**:
- Mirrors bunker savings trend (fuel efficiency = emissions reduction)
- Supports sustainability reporting
- Tracks progress toward environmental goals
- Demonstrates corporate responsibility

---

## 4. Interactive Filters & Drill-Down Capabilities

### Date Range Filter
- **Type**: Dual date picker with slider
- **Range**: 1/1/2025 - 9/29/2025
- **Use Cases**:
  - Compare specific months
  - Analyze quarterly performance
  - Isolate incident periods
  - Year-over-year comparisons (when multi-year data available)

### Liner Filter
- **Type**: Multi-select checklist with search
- **Available Values**: AZQ, BLX, CRY, DPT, EVO, and others (10 total)
- **Use Cases**:
  - Compare performance by shipping line customer
  - Identify liner-specific optimization opportunities
  - Support customer relationship discussions with data
  - Analyze which customers benefit most from PSA network

### Service Filter
- **Type**: Multi-select checklist with search
- **Available Values**: 03J, 15P, 23I, 25Y, 2C7, and others (30 total)
- **Use Cases**:
  - Analyze specific trade lanes
  - Compare route efficiency
  - Identify high-performing vs underperforming services
  - Support service-level agreement (SLA) discussions

### Port/Node Filter (Liner Location)
- **Type**: Multi-select checklist with search (scrollable list)
- **Available Values**: Dynamic based on dataset (typically 9 nodes in current dataset)
- **Important**: The filter list may require scrolling to see all available nodes. The actual nodes available depend on what data exists in the Power BI dataset for the selected date range.
- **Use Cases**:
  - Compare terminal performance
  - Identify best-practice locations
  - Support resource allocation decisions
  - Regional performance analysis (e.g., Asia vs Europe)

---

## 5. Key Performance Indicators (KPIs)

### Primary KPIs
1. **Port Time Savings %** - Target: >15%
2. **Arrival Accuracy %** - Target: >80%
3. **Bunker Savings (USD)** - Target: Increasing trend
4. **Carbon Abatement (tonnes)** - Target: Increasing trend

### Secondary KPIs
- Network utilization (calls per node)
- Service density (calls per service)
- Liner engagement (calls per liner)
- Financial ROI (savings per call)
- Environmental ROI (carbon saved per call)

### Derived KPIs (Calculable)
- **Average Port Time Saved per Call**: Total port time saved / 300 calls
- **Bunker Savings per Call**: $5.55M / 300 = ~$18.5K per call
- **Carbon Abatement per Call**: 58.13K tonnes / 300 = ~194 tonnes per call
- **Monthly Average Bunker Savings**: $5.55M / 9 months = ~$617K/month
- **Monthly Average Carbon Abatement**: 58.13K / 9 = ~6.5K tonnes/month

---

## 6. Data Interpretation Guidelines

### Trend Analysis

**Identifying Strong Performance**:
- Port time savings consistently above 15%
- Arrival accuracy trending upward toward 80%+
- Bunker savings showing increasing monthly trend
- Carbon abatement aligning with or exceeding savings

**Identifying Concerns**:
- Declining port time savings over consecutive months
- Arrival accuracy below 70% or trending downward
- Unexplained drops in bunker savings
- Divergence between financial and environmental metrics

**Seasonal Patterns**:
- Q1 (Jan-Mar): Potential post-holiday adjustment period
- Q2 (Apr-Jun): Strong performance period (observe June peak)
- Q3 (Jul-Sep): Variable performance, possible summer maintenance impacts

### Comparative Analysis

**Liner Comparison**:
- Select multiple liners to compare port time savings
- Identify which operators achieve best arrival accuracy
- Determine which partnerships deliver highest bunker savings

**Service Comparison**:
- Compare trade lane efficiency (e.g., Asia-Europe vs intra-Asia)
- Identify high-volume vs high-efficiency routes
- Support route optimization decisions

**Node Comparison**:
- Benchmark terminal performance
- Identify centers of excellence
- Support best practice sharing across network

### Anomaly Detection

**Red Flags**:
- Sudden drop in arrival accuracy (>10% decrease month-over-month)
- Port time savings falling below 10%
- Bunker savings declining while call volume increases
- Mismatch between bunker savings and carbon abatement

**Investigation Triggers**:
- Any metric showing >20% variance from historical average
- Consistent underperformance by specific liner/service/node
- Unexplained correlation breaks (e.g., savings up but carbon unchanged)

---

## 7. Business Decision Framework

### Decision Types Supported

#### Operational Decisions
- **Berth Allocation**: Use arrival accuracy data to improve berth planning
- **Resource Scheduling**: Align labor/equipment with predicted vessel arrivals
- **Maintenance Windows**: Schedule during low-impact periods identified in trends
- **Traffic Orchestration**: Optimize based on port time savings patterns

#### Strategic Decisions
- **Capacity Planning**: Use calls/node data to inform expansion decisions
- **Technology Investment**: Justify AI/automation ROI with port time savings
- **Customer Engagement**: Use liner-specific data for partnership discussions
- **Sustainability Reporting**: Leverage carbon abatement for corporate communications

#### Tactical Decisions
- **Performance Reviews**: Identify nodes/services needing operational improvement
- **Best Practice Sharing**: Replicate successful patterns from high performers
- **Forecasting**: Use trends to predict future performance and resource needs
- **Problem-Solving**: Diagnose root causes of performance variations

### Recommended Analysis Workflows

#### Monthly Performance Review
1. Check overall summary metrics vs targets
2. Identify best and worst performing month
3. Drill down into underperforming liner/service/node
4. Document lessons learned and action items
5. Update forecasts and targets

#### Customer/Liner Analysis
1. Filter by specific liner
2. Review their port time savings and arrival accuracy
3. Calculate their bunker savings contribution
4. Prepare customer-specific performance report
5. Schedule business review with data-backed insights

#### Sustainability Reporting
1. Extract total carbon abatement for reporting period
2. Calculate equivalent impact (e.g., cars off road, trees planted)
3. Identify top contributing initiatives
4. Project future carbon reduction based on trends
5. Align with corporate ESG goals

#### Continuous Improvement
1. Identify best-performing month/service/node
2. Conduct retrospective to understand success factors
3. Document best practices
4. Pilot replication in lower-performing areas
5. Measure improvement and iterate

---

## 8. Domain Terminology

### Port Operations Terms

**Berth**: Designated location where vessel docks for loading/unloading
**Port Call**: Single vessel visit to a port (arrival to departure)
**Turnaround Time**: Total time vessel spends in port (target: minimize)
**Baseline**: Historical performance benchmark for comparison
**Port Time Savings**: Improvement over baseline turnaround time
**Berth Time**: Duration vessel occupies specific berth
**Assured Port Time**: Predicted/guaranteed port time for vessel

### Shipping Industry Terms

**Liner**: Shipping company operating regular scheduled services
**Service**: Specific route/trade lane operated by liner (e.g., Asia-Europe service)
**Trade Lane**: Geographic shipping route between regions
**Call**: Vessel visit to a port
**Bunker**: Marine fuel oil used by vessels
**Slow Steaming**: Reduced vessel speed to save fuel (common optimization)

### Performance Metrics Terms

**Arrival Accuracy**: Precision of predicted vs actual vessel arrival time
**ATB (Actual Time of Berthing)**: Actual moment vessel docks at berth
**BTR (Berth Time Required)**: Predicted time needed for port operations
**Carbon Abatement**: Carbon emissions prevented through efficiency measures
**Fuel Optimization**: Strategies to reduce fuel consumption

### Network Strategy Terms

**Digital Integration**: Real-time data connectivity across network nodes
**Operational Synergy**: Coordinated operations across multiple terminals
**Node**: Individual port/terminal in PSA's network (Business Unit)
**Network Effect**: Value increase as more nodes/connections are added
**Resilience**: Ability to maintain performance despite disruptions

---

## 9. Stakeholder Perspectives

### Terminal Operators
**Primary Interest**: Port time savings, operational efficiency
**Key Questions**:
- "How does my terminal compare to others?"
- "What's driving our port time savings this month?"
- "Where are our bottlenecks?"

### Liner Customers (Shipping Lines)
**Primary Interest**: Arrival accuracy, reliable scheduling
**Key Questions**:
- "How accurate are PSA's arrival predictions for my vessels?"
- "Am I getting competitive port turnaround times?"
- "What's the carbon footprint of my operations at PSA terminals?"

### PSA Management
**Primary Interest**: Network-wide performance, financial/environmental ROI
**Key Questions**:
- "Are we meeting our sustainability targets?"
- "Which nodes/services need attention?"
- "What's our competitive positioning?"
- "How do we demonstrate value to customers?"

### Sustainability/ESG Teams
**Primary Interest**: Carbon abatement, environmental impact
**Key Questions**:
- "How much carbon are we saving?"
- "Can we quantify our environmental leadership?"
- "Which initiatives deliver the best green ROI?"

### IT/Innovation Teams
**Primary Interest**: Data quality, system performance, AI effectiveness
**Key Questions**:
- "How accurate are our prediction models?"
- "Where can AI deliver additional value?"
- "What data gaps exist?"

---

## 10. AI Conversational Interface Requirements

### Natural Language Understanding

**Supported Query Types**:
- Summary queries: "What's our overall performance?"
- Trend queries: "How are we trending on carbon savings?"
- Comparative queries: "Which liner has the best arrival accuracy?"
- Drill-down queries: "Show me June's performance details"
- Predictive queries: "Based on trends, what should we expect next month?"
- Diagnostic queries: "Why did port time savings drop in July?"

### Response Characteristics

**Clarity**:
- Use business language, not technical jargon
- Define acronyms on first use
- Provide context for numbers (comparisons, percentages)

**Conciseness**:
- Start with headline insight (1 sentence)
- Support with 2-3 key data points
- End with actionable recommendation
- Default to <150 words unless detail requested

**Actionability**:
- Every insight should suggest next steps
- Prioritize recommendations by impact
- Make actions specific and measurable
- Align with PSA strategic objectives

**Accuracy**:
- Only state what's visible in dashboard
- Clearly indicate when data isn't available
- Acknowledge limitations
- Don't extrapolate beyond data support

### Integration Points

**Data Sources**:
- Power BI Embedded dashboard
- Real-time vessel tracking (AIS data)
- Terminal operating systems
- Weather/disruption feeds (for context)

**Output Channels**:
- Conversational UI in dashboard
- Executive summaries via email/reports
- Alert notifications for anomalies
- Integration with business intelligence tools

---

## 11. Success Metrics for AI System

### Quantitative Metrics
- **Response Time**: <2 seconds for standard queries
- **Accuracy**: >95% factual correctness
- **User Adoption**: >70% of dashboard users engage with AI interface
- **Decision Speed**: 50% reduction in time from data to action

### Qualitative Metrics
- **User Satisfaction**: Positive feedback on clarity and usefulness
- **Trust**: Users act on AI recommendations
- **Strategic Alignment**: Insights consistently support PSA objectives
- **Learning**: System improves with usage feedback

---

## 12. Implementation Considerations

### Technical Requirements
- Power BI Embedded API integration
- Natural language processing engine
- Context-aware response generation
- Dashboard filter manipulation via AI commands
- Screenshot/visualization capabilities for explanations

### Data Governance
- Ensure data privacy (anonymization where needed)
- Maintain audit trail of AI recommendations
- Version control for prompt engineering
- Regular validation of AI outputs against human expertise

### User Experience
- Seamless integration into dashboard UI
- Mobile-responsive design
- Accessibility compliance
- Multi-language support (if global deployment)
- Help/tutorial system for first-time users

### Continuous Improvement
- Collect user feedback on AI responses
- A/B test different response styles
- Update domain knowledge as business evolves
- Monitor for changing terminology or metrics
- Regular retraining based on new data patterns

---

## 13. Example Use Cases

### Use Case 1: Monthly Executive Briefing
**Scenario**: Executive needs quick performance summary for board meeting

**User**: "Summarize this month's performance"

**AI Response**:
"September 2025 shows solid network performance: 16% port time savings (above our 15% target), with $654K in bunker savings generating 7.1K tonnes of carbon abatement. Arrival accuracy stands at 61%, slightly below our 80% target—recommend prioritizing prediction model refinement. Compared to peak performance in June (20% savings, $951K), we're maintaining strong efficiency despite seasonal variation."

### Use Case 2: Customer Meeting Preparation
**Scenario**: Account manager preparing for liner customer review

**User**: "Show me performance for liner BLX"

**AI Response**:
"Liner BLX operations demonstrate strong collaboration with PSA: their vessels achieved 17% average port time savings (above network average of 14%) and 75% arrival accuracy. BLX's port calls contributed approximately $850K in bunker savings and 9.2K tonnes carbon abatement over the period. Key strength: consistent performance across multiple nodes. Opportunity: Improving arrival accuracy from 75% to network target of 80% could unlock additional efficiency gains."

### Use Case 3: Anomaly Investigation
**Scenario**: Operations manager notices unexpected metric drop

**User**: "Why did arrival accuracy drop in March?"

**AI Response**:
"March shows 41% inaccurate arrivals (vs 19% in February), a significant variance. This corresponds with a 13% port time savings (vs 16% in February), suggesting external disruptions may have affected schedules. Recommend investigating: (1) weather events during March, (2) specific services or routes with highest inaccuracy, (3) upstream port delays. Filter by service and liner to pinpoint root cause and prevent recurrence."

### Use Case 4: Best Practice Identification
**Scenario**: Continuous improvement team seeking optimization ideas

**User**: "What were the success factors in our best performing month?"

**AI Response**:
"June achieved exceptional results: 20% port time savings, $951K bunker savings, and 81% arrival accuracy. Analysis suggests: (1) Strong coordination across liners—all 10 liners active with balanced workload, (2) Peak efficiency in cargo handling reduced turnaround time, (3) Accurate arrival predictions enabled optimal resource allocation. Recommend conducting June operations retrospective to document best practices, then pilot replication in August-September timeframe."

---

## 14. Appendix: Data Dictionary

| Metric Name | Data Type | Unit | Range | Source System |
|-------------|-----------|------|-------|---------------|
| Liners | Integer | Count | 0-N | Customer Database |
| Services | Integer | Count | 0-N | Service Registry |
| Nodes | Integer | Count | 1-N | Terminal Network |
| Calls Made | Integer | Count | 0-N | Vessel Tracking System |
| Total Bunker Saved | Float | USD | 0-N | Fuel Optimization Engine |
| Total Carbon Abatement | Float | K tonnes | 0-N | Environmental Monitoring |
| Port Time Savings % | Float | Percentage | 0-100 | Terminal Operating System |
| Arrival Accuracy | Float | Percentage | 0-100 | Prediction Model |
| ATB (Local Time) | Datetime | Timestamp | N/A | AIS / Berth Sensors |
| BTR (Final) | String | Y/N | N/A | Prediction Validation |

---

## 15. References & Resources

### PSA Strategic Documents
- PSA Vision 2030: Digital Trade Ecosystem
- Sustainability Report 2024
- Network Integration Whitepaper

### Industry Standards
- IMO 2030/2050 Carbon Reduction Targets
- Port Performance Benchmarking Standards
- Vessel Arrival Prediction Best Practices

### Technical Documentation
- Power BI Embedded API Documentation
- Dashboard User Manual
- Data Source Integration Guide

---

## Document Version
**Version**: 1.0
**Date**: October 2025
**Purpose**: PSA Codesprint Hackathon 2025 - Problem Statement 2
**Owner**: AI Development Team
**Review Cycle**: Quarterly or upon significant dashboard changes
