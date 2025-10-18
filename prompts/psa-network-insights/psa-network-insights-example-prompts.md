# PSA Network Insights - Example Analysis Prompts

This document provides example prompts for analyzing the PSA Network Insights dashboard across different dimensions: liners (shipping operators), port locations (countries/terminals), services (routes), and time periods.

---

## 1. Analysis by Liner (Shipping Operators)

### Example 1.1: Single Liner Performance Review

**User Prompt:**
> "Show me the performance of Liner AZQ across all metrics"

**Analysis Approach:**
1. Navigate to dashboard: http://localhost:3000/powerbi
2. In the Liner filter (operators section), click "Deselect all"
3. Select only "AZQ" checkbox
4. Review updated summary cards and all charts

**Key Insights to Look For:**
- AZQ's contribution to total bunker savings
- Their average port time savings percentage
- Arrival accuracy trend for AZQ vessels
- Which months/services performed best for AZQ

**Expected Response Format:**
> "Liner AZQ demonstrates [strong/moderate/needs improvement] performance across the network. Their vessels achieved [X]% average port time savings (vs network average of 14%), with arrival accuracy at [Y]%. AZQ's operations contributed $[amount] in bunker savings and [Z] K tonnes of carbon abatement. Key strength: [specific metric]. Opportunity: [improvement area]."

---

### Example 1.2: Compare Two Liners

**User Prompt:**
> "Compare the performance of Liner BLX vs Liner CRY. Which one is more efficient?"

**Analysis Approach:**
1. First, filter to BLX only and note key metrics (port time savings %, bunker savings, carbon abatement, arrival accuracy)
2. Take screenshot for reference
3. Then filter to CRY only and note the same metrics
4. Compare the two sets of data

**Key Insights to Look For:**
- Which liner has higher port time savings %?
- Which one has better arrival accuracy?
- Financial impact comparison (bunker savings)
- Environmental impact comparison (carbon abatement)
- Consistency across months

**Expected Response Format:**
> "Comparing BLX and CRY: BLX achieves [X]% port time savings vs CRY's [Y]%, indicating [BLX/CRY] has better operational efficiency. However, CRY shows [Z]% arrival accuracy compared to BLX's [W]%, suggesting [interpretation]. From a financial perspective, [liner] delivered $[amount] more in bunker savings. Recommendation: [actionable insight]."

---

### Example 1.3: Identify Best Performing Liner

**User Prompt:**
> "Which liner is our star performer? Show me the top performer across all key metrics."

**Analysis Approach:**
1. Check each liner individually (AZQ, BLX, CRY, DPT, EVO, etc.)
2. Create a mental scorecard:
   - Port time savings % (higher is better)
   - Arrival accuracy % (higher is better)
   - Bunker savings $ (higher is better)
   - Consistency across months (less variance is better)
3. Identify the liner that scores highest overall

**Key Insights to Look For:**
- Liner with highest port time savings
- Liner with best arrival accuracy
- Liner contributing most to bunker savings
- Liner with most consistent performance

**Expected Response Format:**
> "Analysis of all 10 liners reveals [Liner X] as the top performer. They achieved [X]% port time savings (highest in network), [Y]% arrival accuracy (above target), and contributed $[amount] in bunker savings ([Z]% of total). This exceptional performance is attributed to [reasons]. Recommend: (1) Conduct case study on [Liner X]'s operations, (2) Share best practices with other liners, (3) Explore deeper partnership opportunities."

---

### Example 1.4: Liner Improvement Opportunities

**User Prompt:**
> "Which liner needs the most improvement? Where should we focus our operational support?"

**Analysis Approach:**
1. Review each liner's metrics
2. Identify liner(s) with:
   - Port time savings below 10%
   - Arrival accuracy below 70%
   - Declining trend in bunker savings
3. Investigate potential causes

**Key Insights to Look For:**
- Liner with lowest efficiency metrics
- Specific pain points (is it arrival accuracy? port time?)
- Whether issues are consistent or month-specific
- Which services/ports show the worst performance for this liner

**Expected Response Format:**
> "[Liner Y] shows the greatest opportunity for improvement, with only [X]% port time savings (well below network average of 14%) and [Z]% arrival accuracy. Deep dive reveals the primary challenges are [specific issues]. Recommended actions: (1) [operational intervention], (2) [process improvement], (3) [technology/training support]. Expected impact: Improvement to [target %] could generate additional $[amount] in savings."

---

## 2. Analysis by Port Location (Countries/Terminals)

### Example 2.1: Regional Performance Comparison

**User Prompt:**
> "Compare Asian terminals (BUSAN, JAKARTA, LAEM CHABANG) vs European terminals (ANTWERP). Which region is performing better?"

**Analysis Approach:**
1. Filter to Asian ports: Select BUSAN, JAKARTA, LAEM CHABANG
2. Note summary metrics (total calls, bunker savings, carbon abatement, avg port time savings)
3. Take screenshot
4. Filter to European ports: Select ANTWERP
5. Compare the regional metrics

**Key Insights to Look For:**
- Regional differences in port time savings
- Arrival accuracy patterns by region
- Volume of calls (activity level) by region
- Financial and environmental impact by region

**Expected Response Format:**
> "Regional analysis shows [Asian/European] terminals leading in operational efficiency. Asian terminals (BUSAN, JAKARTA, LAEM CHABANG) collectively achieved [X]% average port time savings with [Y] vessel calls, generating $[amount] in bunker savings. In comparison, ANTWERP (representing European operations) achieved [Z]% port time savings with [W] calls and $[amount] savings. [Region] demonstrates stronger [specific metric] due to [reasons]. Cross-regional best practice opportunities: [recommendations]."

---

### Example 2.2: Identify Best Terminal

**User Prompt:**
> "Which PSA terminal is our center of excellence? Show me the top performing port."

**Analysis Approach:**
1. Filter to each port location individually
2. Compare key metrics:
   - Port time savings %
   - Arrival accuracy %
   - Bunker savings per call (total savings / number of calls)
   - Carbon abatement per call
3. Identify consistent high performer

**Key Insights to Look For:**
- Terminal with highest efficiency
- Volume of operations (calls handled)
- Per-call efficiency (savings per vessel)
- Consistency and reliability

**Expected Response Format:**
> "[Terminal X] emerges as PSA's center of excellence, achieving [X]% port time savings (highest among all nodes) with [Y]% arrival accuracy. Despite handling [Z] calls, they maintained exceptional per-call efficiency of $[amount] bunker savings and [W] tonnes carbon abatement per vessel. Success factors include: [reasons]. Recommendation: Document [Terminal X]'s operational playbook and conduct knowledge transfer workshops with other terminals."

---

### Example 2.3: Port-Specific Optimization

**User Prompt:**
> "What's happening at DAMMAM terminal? How can we improve performance there?"

**Analysis Approach:**
1. Filter to DAMMAM only
2. Review all metrics compared to network average
3. Examine monthly trends (improving or declining?)
4. Identify specific weak points

**Key Insights to Look For:**
- Current performance vs network average
- Trend direction (getting better or worse?)
- Specific challenges (arrival accuracy? port time?)
- Comparison to similar-sized terminals

**Expected Response Format:**
> "DAMMAM terminal is currently achieving [X]% port time savings, [compare to network average]. Analysis reveals [specific challenge, e.g., 'arrival accuracy has declined from Y% to Z% over the past 3 months']. Contributing factors appear to be [reasons]. Recommended interventions: (1) [specific action], (2) [process change], (3) [technology/resource allocation]. Benchmark against [similar terminal] which achieved [metrics] through [best practice]."

---

### Example 2.4: Multi-Terminal Comparison for Capacity Planning

**User Prompt:**
> "We're considering expanding capacity. Which terminals have headroom vs which are at capacity? Show me the data."

**Analysis Approach:**
1. Review "Calls Made" metric for each terminal
2. Compare port time savings % (lower might indicate congestion)
3. Look at arrival accuracy trends
4. Identify terminals with declining efficiency despite increasing volume

**Key Insights to Look For:**
- Terminals handling high volume with maintained efficiency (good capacity)
- Terminals showing efficiency decline (potential capacity constraints)
- Terminals with low volume and high efficiency (expansion opportunity)
- Month-over-month volume trends

**Expected Response Format:**
> "Capacity analysis across PSA's 9 terminals reveals: HIGH CAPACITY HEADROOM: [Terminal A] shows [X] calls with [Y]% efficiency, suggesting room for growth. POTENTIAL CONSTRAINTS: [Terminal B] handled [Z] calls with declining port time savings from [A]% to [B]%, indicating possible capacity stress. EXPANSION CANDIDATES: [Terminal C] demonstrates strong [W]% efficiency with moderate [V] call volume, suggesting successful expansion potential. Recommend detailed operational review of [Terminal B] before Q[X] peak season."

---

## 3. Analysis by Service (Routes/Trade Lanes)

### Example 3.1: Service Route Efficiency Comparison

**User Prompt:**
> "Compare Service 03J vs Service 15P. Which route is more efficient?"

**Analysis Approach:**
1. Filter to Service 03J only
2. Note port time savings %, arrival accuracy, bunker savings, carbon abatement
3. Take screenshot
4. Filter to Service 15P only
5. Compare metrics

**Key Insights to Look For:**
- Which service has better port time efficiency?
- Arrival accuracy differences (route predictability)
- Financial performance (bunker savings)
- Volume of calls per service

**Expected Response Format:**
> "Service comparison reveals: SERVICE 03J achieved [X]% port time savings with [Y]% arrival accuracy across [Z] calls, while SERVICE 15P delivered [A]% port time savings with [B]% arrival accuracy across [C] calls. [Service] demonstrates superior efficiency, likely due to [reasons: route characteristics, terminal selection, vessel types, etc.]. Bunker savings comparison: 03J contributed $[amount] vs 15P's $[amount]. Recommendation: [actionable insight for the underperforming service]."

---

### Example 3.2: Identify Most Profitable Service

**User Prompt:**
> "Which service route generates the most value for PSA in terms of bunker savings and carbon reduction?"

**Analysis Approach:**
1. Check each service individually (03J, 15P, 23I, 25Y, 2C7, etc.)
2. Focus on bunker savings $ and carbon abatement tonnes
3. Calculate per-call efficiency if call volume data is available
4. Identify top contributor

**Key Insights to Look For:**
- Service with highest absolute bunker savings
- Service with highest carbon abatement
- Per-call efficiency (value per vessel)
- Consistency across months

**Expected Response Format:**
> "[Service X] emerges as PSA's most valuable service route, generating $[amount] in bunker savings ([Y]% of total network savings) and [Z] K tonnes of carbon abatement. This service achieved [A]% port time savings with [B]% arrival accuracy. The strong performance is attributed to [factors: optimized route, efficient terminals, good coordination]. Strategic recommendation: (1) Prioritize capacity for this service, (2) Explore expansion opportunities on similar routes, (3) Use as benchmark for other services."

---

### Example 3.3: Service Performance Trends

**User Prompt:**
> "Show me the performance trend for Service 23I over time. Is it improving or declining?"

**Analysis Approach:**
1. Filter to Service 23I only
2. Examine monthly charts (Port Time Savings, Arrival Accuracy, Bunker Savings)
3. Identify upward or downward trends
4. Note any significant month-over-month changes

**Key Insights to Look For:**
- Direction of trend (improving/declining/stable)
- Significant anomalies or outliers
- Seasonal patterns
- Recent performance vs earlier months

**Expected Response Format:**
> "Service 23I trend analysis (Jan-Sep 2025): Port time savings shows [improving/declining/stable] pattern, moving from [X]% in January to [Y]% in September. Arrival accuracy [improved/declined] from [A]% to [B]%. Notable observation: [specific month] showed exceptional/poor performance due to [reason if known]. Current trajectory suggests [prediction]. Recommended action: [continue current strategy / investigate decline / replicate success factors]."

---

### Example 3.4: Service Optimization Across Multiple Terminals

**User Prompt:**
> "Service 25Y operates across multiple terminals. Which terminal performs best for this service?"

**Analysis Approach:**
1. Filter to Service 25Y
2. Note overall metrics
3. Then additionally filter by each terminal/port location one at a time
4. Compare terminal-specific performance for this service

**Key Insights to Look For:**
- Which terminal delivers best efficiency for Service 25Y?
- Are there terminals where this service struggles?
- Port-specific best practices for this route
- Resource allocation opportunities

**Expected Response Format:**
> "Service 25Y multi-terminal analysis: Overall service achieves [X]% port time savings and [Y]% arrival accuracy. Terminal breakdown reveals: [Terminal A] excels with [Z]% port time savings for 25Y calls, while [Terminal B] shows [W]% (below service average). This variance suggests [reasons: terminal capabilities, route timing, local conditions]. Recommendation: (1) Study [Terminal A]'s handling procedures for 25Y, (2) Implement improvements at [Terminal B], (3) Consider route optimization to maximize calls at high-performing terminals."

---

## 4. Time-Based Analysis

### Example 4.1: Monthly Trend Identification

**User Prompt:**
> "What are the key trends across the 9-month period? Are we improving?"

**Analysis Approach:**
1. Keep all filters at default (full network view)
2. Examine each monthly chart:
   - Port Time Savings: Look for upward/downward slope
   - Arrival Accuracy: Check if green line (Y) is trending up
   - Bunker Savings: Identify increasing/decreasing pattern
   - Carbon Abatement: Check correlation with bunker savings
3. Identify overall trajectory

**Key Insights to Look For:**
- Overall improvement vs decline
- Consistency or high variability
- Seasonal patterns (e.g., summer vs other months)
- Correlation between metrics

**Expected Response Format:**
> "Network-wide trend analysis (Jan-Sep 2025): Port time savings shows [upward/downward/stable] trend, averaging [X]% with peak of [Y]% in [month]. Arrival accuracy [improved/remained stable/declined], currently at [Z]%. Financial impact: Bunker savings totaled $5.55M with strongest months being [months], averaging $[amount]/month. Environmental impact: 58.13K tonnes carbon abatement achieved. Overall assessment: [positive/needs attention]. Key observation: [pattern noticed]. Strategic focus: [recommendation]."

---

### Example 4.2: Best vs Worst Month Analysis

**User Prompt:**
> "What made June the best performing month? And why did [worst month] underperform?"

**Analysis Approach:**
1. Identify June as peak month (20% port time savings, $951K bunker savings)
2. Identify worst performing month from charts
3. Compare the two months across all metrics
4. Look for potential external factors (this may require additional context)

**Key Insights to Look For:**
- Metric comparison between best and worst month
- Volume differences (number of calls)
- Which liners/services/ports contributed to the difference
- Potential seasonal or external factors

**Expected Response Format:**
> "JUNE (Best Month): Achieved 20% port time savings, $951K bunker savings, 8.6K tonnes carbon abatement, and 81% arrival accuracy. Success factors: [analysis - e.g., 'all 10 liners active with balanced workload, optimal resource allocation']. [WORST MONTH]: Showed [X]% port time savings, $[amount] bunker savings, [Y]% arrival accuracy. Contributing challenges: [analysis - e.g., 'concentrated call schedule, lower liner participation, or potential external disruptions']. Learning opportunity: Replicate June's [specific practices] while avoiding [worst month's issues]."

---

### Example 4.3: Seasonal Pattern Recognition

**User Prompt:**
> "Do we see any seasonal patterns? How does Q1 compare to Q2 compare to Q3?"

**Analysis Approach:**
1. Group months into quarters:
   - Q1: Jan, Feb, Mar
   - Q2: Apr, May, Jun
   - Q3: Jul, Aug, Sep
2. Calculate average metrics for each quarter
3. Identify patterns and differences

**Key Insights to Look For:**
- Quarterly performance trends
- Seasonal efficiency variations
- Quarter-over-quarter improvement
- Potential seasonal challenges (weather, holidays, peak seasons)

**Expected Response Format:**
> "Seasonal analysis reveals distinct quarterly patterns: Q1 (Jan-Mar) averaged [X]% port time savings with $[amount] bunker savings. Q2 (Apr-Jun) showed [improvement/decline] to [Y]% savings and $[amount], representing [Z]% change. Q3 (Jul-Sep) delivered [A]% savings and $[amount]. Pattern observed: [specific trend, e.g., 'Q2 consistently outperforms due to favorable weather and optimized schedules']. Recommendation: [leverage Q2 practices / prepare for Q4 challenges / address Q-specific issues]."

---

### Example 4.4: Forecasting Next Period

**User Prompt:**
> "Based on the trends, what should we expect for October-December performance?"

**Analysis Approach:**
1. Identify current trend direction (last 3 months)
2. Calculate rate of change
3. Consider seasonal factors if any pattern exists
4. Project forward with caveats

**Key Insights to Look For:**
- Recent momentum (last 2-3 months trend)
- Historical patterns (if Q4 2024 data were available)
- Known upcoming factors (e.g., peak season, maintenance planned)
- Sustainability of current performance

**Expected Response Format:**
> "Forward projection (Oct-Dec 2025): Based on Jul-Sep trend showing [direction], we project Q4 port time savings around [X]% (±2%), bunker savings of approximately $[amount] per month, and arrival accuracy of [Y]%. Confidence factors: [what supports this projection]. Risk factors: [potential disruptions]. Recommended preparations: (1) [proactive measure], (2) [resource planning], (3) [contingency plan]. Note: Projection assumes [assumptions]; monitor [leading indicators] for early adjustment signals."

---

## 5. Multi-Dimensional Analysis (Complex Queries)

### Example 5.1: Liner Performance at Specific Terminal

**User Prompt:**
> "How does Liner AZQ perform specifically at BUSAN terminal? Is this a strong partnership?"

**Analysis Approach:**
1. Filter to Liner AZQ only
2. Additionally filter to BUSAN port only
3. Review all metrics for this specific combination
4. Compare to AZQ's network-wide performance and BUSAN's overall performance

**Key Insights to Look For:**
- AZQ-at-BUSAN metrics vs AZQ overall
- AZQ-at-BUSAN metrics vs BUSAN overall
- Specific strengths or challenges in this pairing
- Volume of AZQ calls at BUSAN

**Expected Response Format:**
> "AZQ-BUSAN partnership analysis: When operating at BUSAN, Liner AZQ achieves [X]% port time savings (vs AZQ network average of [Y]% and BUSAN overall average of [Z]%). Arrival accuracy for AZQ vessels at BUSAN stands at [A]%, contributing $[amount] in bunker savings. Assessment: This is a [strong/moderate/challenged] partnership. [If strong:] Success factors include [reasons]. Recommendation: Expand AZQ call volume at BUSAN. [If challenged:] Key issues are [problems]. Recommendation: Joint operational review to address [specific areas]."

---

### Example 5.2: Service Performance in Specific Time Period at Specific Port

**User Prompt:**
> "During Q2 (April-June), how did Service 15P perform at JAKARTA terminal?"

**Analysis Approach:**
1. Set date range: April 1 to June 30, 2025
2. Filter to Service 15P
3. Filter to JAKARTA port
4. Review highly specific metrics

**Key Insights to Look For:**
- Very specific performance data
- Comparison to broader contexts (Q2 overall, Service 15P overall, JAKARTA overall)
- Any unique characteristics of this combination

**Expected Response Format:**
> "Q2 2025 analysis for Service 15P at JAKARTA: This specific combination achieved [X]% port time savings with [Y]% arrival accuracy. Compared to Service 15P's overall Q2 performance ([A]%), JAKARTA operations were [better/worse/similar]. Compared to all JAKARTA Q2 operations ([B]%), Service 15P was [better/worse/similar]. Bunker savings contribution: $[amount]. Observations: [specific insights]. This data suggests [business conclusion] and supports decision to [recommendation]."

---

### Example 5.3: Root Cause Analysis for Specific Issue

**User Prompt:**
> "Arrival accuracy dropped significantly in March. Which liner, service, or terminal was responsible? Drill down and find the root cause."

**Analysis Approach:**
1. Start with March date filter
2. Note overall poor arrival accuracy (e.g., 41% inaccurate)
3. Systematically filter by each liner to identify if one is the culprit
4. Then filter by each service
5. Then filter by each terminal
6. Identify the common factor

**Key Insights to Look For:**
- Which dimension (liner/service/port) shows the largest deviation?
- Is it one bad actor or systemic?
- Was it a one-time event or trend?
- Potential external causes

**Expected Response Format:**
> "March arrival accuracy root cause analysis: Overall network showed 41% inaccurate arrivals (vs 19% in Feb). Drill-down reveals: [LINER LEVEL] [Liner X] contributed disproportionately with [Y]% inaccurate arrivals. [SERVICE LEVEL] Services [A] and [B] showed highest inaccuracy at [Z]%. [TERMINAL LEVEL] [Terminal C] experienced [W]% inaccuracy. ROOT CAUSE: [Primary factor - e.g., 'Liner X's vessels on Services A&B arriving at Terminal C all experienced delays due to [upstream port congestion / weather / specific operational issue]']. Corrective actions taken: [if known]. Prevention: [recommendation]."

---

### Example 5.4: Best Practice Identification Across Dimensions

**User Prompt:**
> "Find our 'golden triangle' - which combination of liner + service + terminal delivers the absolute best results?"

**Analysis Approach:**
1. This requires systematic testing of combinations
2. Start with best liner, then filter by each service, then by each terminal
3. Document top 3-5 combinations
4. Identify the single best performer

**Key Insights to Look For:**
- Combination with highest port time savings
- Combination with best arrival accuracy
- Combination with highest per-call bunker savings
- Consistent excellence across all metrics

**Expected Response Format:**
> "Golden triangle analysis across all combinations reveals: TOP PERFORMER: [Liner X] operating [Service Y] through [Terminal Z] achieved exceptional [A]% port time savings, [B]% arrival accuracy, $[amount] bunker savings, and [C] tonnes carbon abatement. This represents [D]% above network average. Success factors: [why this combination works - route characteristics, terminal capabilities, operational alignment]. RUNNER-UP: [Alternative combination]. Strategic recommendation: (1) Maximize capacity for golden triangle combination, (2) Study and document best practices, (3) Replicate success model with similar characteristics in other combinations."

---

## 6. Sustainability & Financial Analysis

### Example 6.1: Carbon Reduction Leadership

**User Prompt:**
> "Which liner contributes most to our carbon reduction goals? Show me the environmental leaders."

**Analysis Approach:**
1. Filter to each liner individually
2. Focus on Carbon Abatement (K tonnes) metric
3. Rank liners by environmental impact
4. Correlate with bunker savings

**Key Insights to Look For:**
- Liner with highest absolute carbon abatement
- Liner with best carbon abatement per call
- Correlation between carbon reduction and operational efficiency
- Consistency across time period

**Expected Response Format:**
> "Environmental impact analysis reveals [Liner X] as carbon reduction leader, achieving [Y] K tonnes of carbon abatement ([Z]% of network total) through [W] vessel calls. This represents [A] tonnes per call, [B]% above network average. Strong correlation observed between [Liner X]'s [C]% port time savings and environmental performance. Runner-up: [Liner 2] with [metrics]. Recognition opportunity: Highlight [Liner X] in PSA sustainability report. Engagement strategy: Share environmental ROI data with all liners to encourage similar practices."

---

### Example 6.2: Financial ROI by Terminal

**User Prompt:**
> "Calculate the financial ROI for each terminal. Which port delivers the best return?"

**Analysis Approach:**
1. Filter to each terminal individually
2. Note bunker savings $ for each
3. Note number of calls handled
4. Calculate per-call ROI (savings ÷ calls)
5. Rank terminals

**Key Insights to Look For:**
- Terminal with highest absolute bunker savings
- Terminal with highest per-call savings
- Volume vs efficiency balance
- Operational models that drive ROI

**Expected Response Format:**
> "Financial ROI analysis across 9 terminals: [Terminal A] leads with $[amount] total bunker savings across [X] calls, delivering $[Y] per call. [Terminal B] shows highest per-call ROI at $[Z] per vessel despite [lower/moderate] call volume. [Terminal C] handles highest volume ([W] calls) with solid $[V] per call. Insights: [Terminal A] combines scale and efficiency. [Terminal B] demonstrates premium efficiency model. Recommendation: (1) Scale [Terminal B]'s practices to higher-volume terminals, (2) Maintain [Terminal A]'s balanced approach, (3) Optimize [underperforming terminal]."

---

### Example 6.3: Sustainability Report Generation

**User Prompt:**
> "Generate a sustainability summary for our quarterly ESG report covering Q2 2025 environmental achievements."

**Analysis Approach:**
1. Set date range: April 1 - June 30, 2025
2. Extract carbon abatement total for Q2
3. Calculate bunker savings for Q2
4. Identify key contributors and success stories
5. Translate to real-world equivalents if possible

**Key Insights to Look For:**
- Total carbon abatement for quarter
- Total bunker savings for quarter
- Best performing month/liner/terminal
- Year-over-year or quarter-over-quarter improvement

**Expected Response Format:**
> "Q2 2025 SUSTAINABILITY SUMMARY: Environmental Achievement: PSA's global network prevented [X] K tonnes of carbon emissions through operational optimization and efficiency measures. This is equivalent to [real-world comparison: e.g., 'removing Y cars from the road for a year' or 'planting Z trees']. Financial-Environmental Synergy: These carbon reductions were achieved while generating $[amount] in fuel cost savings, demonstrating that sustainability and profitability are aligned. Key Contributor: [Terminal/Liner/Service] led with [specific achievement]. Quarter Highlights: June set record performance with 8.6K tonnes abatement and 20% port time savings. Outlook: On track to achieve [annual goal] by year-end."

---

### Example 6.4: Cost-Benefit Analysis of Optimization Initiative

**User Prompt:**
> "If we could improve arrival accuracy from current 70% to target 85%, what would be the financial and environmental impact?"

**Analysis Approach:**
1. Note current arrival accuracy average (~70%)
2. Note current bunker savings and carbon abatement
3. Research correlation between arrival accuracy and efficiency
4. Project impact of 15% improvement

**Key Insights to Look For:**
- Current baseline metrics
- Historical correlation between accuracy and efficiency
- Theoretical maximum impact
- Investment required vs benefit gained

**Expected Response Format:**
> "Arrival Accuracy Improvement Impact Analysis: CURRENT STATE: Network averaging ~70% arrival accuracy, generating $5.55M bunker savings and 58.13K tonnes carbon abatement over 9 months. HISTORICAL CORRELATION: Months with >80% accuracy (e.g., June at 81%) showed [X]% higher port time savings and [Y]% higher bunker savings. PROJECTED IMPACT: Improving accuracy from 70% to 85% could potentially: - Increase bunker savings by $[amount] ([Z]% improvement) - Add [W] K tonnes additional carbon abatement - Improve port time savings by [V]% - Enhance customer satisfaction and competitive positioning. INVESTMENT NEEDED: [Technology upgrades, process improvements, training]. ROI TIMELINE: [Estimated payback period]. RECOMMENDATION: [Prioritize / Phase approach / Pilot first]."

---

## 7. Executive & Strategic Analysis

### Example 7.1: Executive Dashboard Summary

**User Prompt:**
> "Give me a 60-second executive summary of our network performance for the board meeting."

**Analysis Approach:**
1. Keep full network view (no filters)
2. Extract headline numbers
3. Identify top 2-3 wins and 1 challenge
4. Focus on strategic implications

**Key Insights to Look For:**
- Overall performance vs targets
- Most impressive achievement
- Key area of concern
- Strategic implications

**Expected Response Format:**
> "EXECUTIVE SUMMARY (Jan-Sep 2025): PSA's global network delivered strong performance across 10 liner partners, 30 services, and 9 terminals, completing 300 port calls. KEY ACHIEVEMENTS: (1) Generated $5.55M in bunker savings while reducing carbon emissions by 58.13K tonnes, demonstrating aligned financial-environmental objectives. (2) Averaged 14% port time savings vs baseline, with June peak at 20%. (3) 9-node digital integration enables real-time optimization. OPPORTUNITY: Arrival accuracy at 59-82% (target: 80%+); improving prediction models could unlock additional $[X]M in efficiency gains. STRATEGIC POSITION: Network demonstrates resilience amid 2025 trade disruptions; data-driven operations provide competitive advantage. NEXT STEPS: [Top 2 recommendations]."

---

### Example 7.2: Competitive Positioning Analysis

**User Prompt:**
> "How do our metrics compare to industry benchmarks? Are we leading or lagging?"

**Analysis Approach:**
1. Review PSA metrics
2. Note: Actual industry benchmarks would come from external research
3. Provide relative positioning based on performance indicators
4. Identify competitive advantages

**Key Insights to Look For:**
- Metrics that indicate market leadership
- Areas where PSA outperforms typical industry standards
- Unique competitive advantages from data
- Areas needing improvement to match competition

**Expected Response Format:**
> "COMPETITIVE POSITIONING ASSESSMENT: Based on PSA's Network Insights data: STRENGTHS: (1) 14% average port time savings indicates operations above industry standard (~8-10%). (2) Digital integration across 9 nodes provides visibility advantage over fragmented competitors. (3) $18.5K bunker savings per call demonstrates optimization leadership. (4) 58.13K tonnes carbon abatement positions PSA as sustainability leader. AREAS FOR IMPROVEMENT: Arrival accuracy of 59-82% [compare to industry if benchmark available]. COMPETITIVE MOAT: Real-time network orchestration, AI-driven optimization, and multi-node synergy create defensible advantages. MARKET OPPORTUNITY: PSA's data infrastructure and proven efficiency gains position company to attract quality-focused liner partners amid industry disruption."

---

### Example 7.3: Strategic Planning Insights

**User Prompt:**
> "Based on this data, where should we invest for growth? Which areas have the most potential?"

**Analysis Approach:**
1. Identify high-performing combinations (liner+service+terminal)
2. Identify underutilized capacity
3. Identify improvement opportunities with highest ROI
4. Consider strategic market trends

**Key Insights to Look For:**
- Successful models to replicate/scale
- Terminals with capacity headroom
- Services/routes with growth potential
- Technology/process investments with proven ROI

**Expected Response Format:**
> "STRATEGIC INVESTMENT PRIORITIES: Based on data analysis: HIGH-ROI OPPORTUNITIES: (1) SCALE EXCELLENCE: [Terminal X] and [Liner Y] demonstrate proven efficiency. Recommend capacity expansion to capture additional volume on high-performing routes. Projected ROI: $[amount] additional savings. (2) REPLICATE SUCCESS: June's 20% port time savings model shows what's possible. Invest in operational practices and technologies that enabled June performance. Apply network-wide for [X]% improvement potential. (3) FIX FUNDAMENTALS: Arrival accuracy improvement from 70% to 85% could generate $[amount] impact. Prioritize prediction model upgrades and real-time data integration. (4) EXPAND NETWORK: [Geographic/service gap identified] represents whitespace opportunity. CAPITAL ALLOCATION: Recommend [X]% to technology, [Y]% to capacity, [Z]% to operational excellence."

---

## 8. Troubleshooting & Diagnostic Prompts

### Example 8.1: Performance Decline Investigation

**User Prompt:**
> "Port time savings dropped from 18% in August to 15% in September. What happened? Find the cause."

**Analysis Approach:**
1. Filter to September
2. Compare to August across all dimensions
3. Systematically check: liners, services, terminals
4. Look for significant changes in any category

**Key Insights to Look For:**
- Volume changes (more/fewer calls)
- Specific liner/service/terminal showing decline
- External factors (if context available)
- Correlation with other metrics

**Expected Response Format:**
> "September Performance Decline Diagnosis: Port time savings fell 3 percentage points from August (18% → 15%). ROOT CAUSE ANALYSIS: [Systematic investigation findings - e.g., '(1) Liner DPT showed significant decline from 20% to 12% savings, (2) Service 25Y experienced delays, (3) JAKARTA terminal handled 40% more calls with same resources, indicating capacity strain']. CONTRIBUTING FACTORS: [Additional context]. IMPACT: $[amount] opportunity cost in bunker savings. CORRECTIVE ACTIONS: [Specific recommendations to restore performance]. MONITORING: Track [leading indicators] for early warning of similar issues."

---

## 9. Multi-Language Support Examples

### Example 9.1: Korean Response (한국어)

**User Locale:** Korean (ko)

**User Prompt:**
> "6월 성과를 요약해주세요"

**Analysis Approach:**
1. Agent recognizes user's Korean language preference
2. Analyzes June performance data from dashboard
3. Formats response in Korean with English metric names

**Expected Response:**
> "**6월 2025년 성과 요약:**
>
> 6월은 PSA 네트워크에서 예외적인 성과를 보인 달입니다:
>
> **핵심 성과 지표:**
> - Port Time Savings: 20% (기간 중 최고)
> - Bunker Savings: $0.95M (거의 100만 달러!)
> - Carbon Abatement: 8.6K tonnes (최고 탄소 감축)
> - Arrival Accuracy: 약 81-82%
>
> **분석:** 6월의 뛰어난 성과는 10개 선사가 모두 활동하며 균형 잡힌 업무량을 유지했고, 효율적인 화물 처리로 선박 체류 시간이 16% 단축되었으며, 정확한 도착 예측으로 최적의 자원 배분이 가능했기 때문입니다.
>
> **전략적 의미:** 6월의 20% Port Time Savings는 달성 가능한 목표치를 보여줍니다. 선박이 과거 10시간 소요되던 작업을 이제 8시간 만에 완료할 수 있습니다.
>
> **권장 사항:**
> 1. 6월의 운영 관행에 대한 회고 분석 실시
> 2. 성공 전략을 다른 달과 터미널에 복제
> 3. 최고 성과 요인을 문서화하여 네트워크 전체에 공유"

---

### Example 9.2: Japanese Response (日本語)

**User Locale:** Japanese (ja)

**User Prompt:**
> "Liner AZQのパフォーマンスを分析してください"

**Analysis Approach:**
1. Filter to Liner AZQ only (click "Deselect all" then select AZQ)
2. Review all metrics for AZQ
3. Provide analysis in Japanese

**Expected Response:**
> "**Liner AZQ パフォーマンス分析:**
>
> AZQはPSAネットワーク全体で優れたパフォーマンスを示しています:
>
> **運用指標:**
> - Port Time Savings: 17% (ネットワーク平均14%を上回る)
> - Arrival Accuracy: 75%
> - Bunker Savings: 約$850K (9ヶ月間)
> - Carbon Abatement: 9.2K tonnes
>
> **強みの分析:** AZQは複数のノードで一貫した効率性を維持しており、これはfleet管理の質の高さを示しています。Port Time Savingsが17%という数値は、PSAのターミナルとAZQの船舶運用の良好な連携を証明しています。
>
> **改善の機会:**
> - Arrival Accuracy が75%で、目標の80%を若干下回っています
> - 予測モデルの精度向上により、さらなる効率化が期待できます
>
> **推奨アクション:**
> 1. AZQの運営慣行のケーススタディを実施
> 2. 到着予測の精度向上に向けた協力強化
> 3. Service別のパフォーマンスを詳細分析し、最適routeを特定
> 4. AZQとのパートナーシップ深化の機会を探る
>
> **結論:** AZQはPSAの戦略的パートナーであり、ネットワーク全体の効率向上に大きく貢献しています。"

---

### Example 9.3: Chinese Response (中文)

**User Locale:** Chinese (zh)

**User Prompt:**
> "比较BUSAN和JAKARTA两个码头的表现"

**Analysis Approach:**
1. Filter to BUSAN, note metrics, take screenshot
2. Filter to JAKARTA, note metrics, compare
3. Provide comparative analysis in Chinese

**Expected Response:**
> "**BUSAN vs JAKARTA 码头性能对比分析:**
>
> **BUSAN 码头 (韩国):**
> - Port Time Savings: 18%
> - Arrival Accuracy: 79%
> - Bunker Savings: $1.2M
> - 处理船舶数: 95次
> - 每次Call平均节省: $12,630
>
> **JAKARTA 码头 (印度尼西亚):**
> - Port Time Savings: 15%
> - Arrival Accuracy: 68%
> - Bunker Savings: $0.9M
> - 处理船舶数: 78次
> - 每次Call平均节省: $11,538
>
> **对比分析:**
>
> 1. **效率差距:** BUSAN在所有关键指标上都优于JAKARTA。Port Time Savings高出3个百分点(18% vs 15%)，这意味着BUSAN处理船舶速度更快。
>
> 2. **到达准确性:** BUSAN的79% Arrival Accuracy明显优于JAKARTA的68%。这11个百分点的差距表明BUSAN在预测管理和资源规划方面更加成熟。
>
> 3. **财务影响:** 尽管JAKARTA处理的船舶较少，但每次Call的平均Bunker Savings相当接近，说明JAKARTA的基础效率并不差。
>
> **根本原因分析:**
> - 自动化程度: BUSAN可能拥有更先进的自动化设施
> - 基础设施成熟度: BUSAN是established的大型港口
> - 运营经验: BUSAN团队可能在流程优化方面更有经验
> - 地理位置: 不同的贸易路线和气候条件影响
>
> **战略建议:**
> 1. **知识转移:** 组织BUSAN和JAKARTA之间的最佳实践交流workshop
> 2. **重点改进JAKARTA:**
>    - 优先提升Arrival Accuracy从68%到80%
>    - 投资预测模型和实时数据集成
>    - 审查berth分配流程
> 3. **BUSAN继续优化:** 目标是达到20%+ Port Time Savings(6月全网峰值水平)
> 4. **benchmarking计划:** 让JAKARTA学习BUSAN的成功经验
>
> **预期影响:** 如果JAKARTA能达到BUSAN的效率水平，预计可额外节省约$300K Bunker Savings，并减少1.5K tonnes碳排放。"

---

### Example 9.4: Spanish Response (Español)

**User Locale:** Spanish (es)

**User Prompt:**
> "¿Cuál fue el mejor mes y por qué?"

**Expected Response:**
> "**Análisis del Mejor Mes - Junio 2025:**
>
> **Desempeño Excepcional:**
> Junio 2025 fue, sin duda, el mes más destacado con resultados extraordinarios en todos los indicadores:
>
> - Port Time Savings: 20% (el más alto del período)
> - Bunker Savings: $0.95M (casi $1 millón)
> - Carbon Abatement: 8.6K tonnes (máxima reducción)
> - Arrival Accuracy: 81-82%
>
> **Factores de Éxito:**
>
> 1. **Operaciones Equilibradas:** Los 10 liners estuvieron activos con una distribución uniforme de workload, evitando congestión.
>
> 2. **Coordinación Óptima:** El 20% de Port Time Savings significa que los buques pasaron 20% menos tiempo en puerto que el baseline. Un buque que antes tardaba 10 horas ahora completaba operaciones en 8 horas.
>
> 3. **Alta Precisión de Llegadas:** Con 81-82% Arrival Accuracy, pudimos planificar recursos con mayor precisión, teniendo grúas y personal listos en el momento exacto.
>
> 4. **Eficiencia de Combustible:** $0.95M en Bunker Savings demuestra que la velocidad operativa se tradujo en ahorro real de combustible.
>
> **Impacto Estratégico:**
>
> - **Ambiental:** 8.6K tonnes de Carbon Abatement equivale a retirar aproximadamente 1,860 automóviles de las calles durante un año.
>
> - **Financiero:** Casi $1M en un solo mes prueba el ROI de las optimizaciones con IA.
>
> - **Operacional:** Demostró que 20%+ efficiency gain es alcanzable, estableciendo un nuevo benchmark.
>
> **Recomendaciones Estratégicas:**
>
> 1. **Retrospectiva Detallada:** Realizar un análisis profundo de las prácticas operacionales de junio:
>    - ¿Qué schedules funcionaron mejor?
>    - ¿Cómo se asignaron los recursos?
>    - ¿Qué tecnologías o procesos contribuyeron?
>
> 2. **Replicación:** Aplicar los learnings de junio a otros meses, especialmente aquellos con Port Time Savings <12%.
>
> 3. **Benchmarking Interno:** Usar junio como gold standard para evaluar performance futuro.
>
> 4. **Capacitación:** Compartir las best practices de junio con todos los terminals del network.
>
> **Nota Importante:** Comparando con julio (9% Port Time Savings), vemos que es posible duplicar la eficiencia. Esto representa una oportunidad significativa de mejora."

---

### Example 9.5: French Response (Français)

**User Locale:** French (fr)

**User Prompt:**
> "Quels sont les principaux défis et opportunités d'amélioration?"

**Expected Response:**
> "**Analyse des Défis et Opportunités - Réseau PSA:**
>
> Basé sur les données de janvier à septembre 2025, voici l'évaluation stratégique:
>
> **🎯 Opportunité Principale: Arrival Accuracy**
>
> **Situation Actuelle:**
> - Fluctue entre 59% et 82% selon les mois
> - Actuellement loin de l'objectif de 80%+ consistant
> - Mars a montré 41% arrivals inexacts (vs 19% en février)
>
> **Impact:**
> - Planning des ressources sous-optimal
> - Grues et personnel pas toujours disponibles au bon moment
> - Perte potentielle d'efficacité de $500K+ estimée
>
> **Solution Recommandée:**
> 1. Améliorer les modèles de prédiction IA
> 2. Intégrer plus de données en temps réel (AIS, météo, congestion ports)
> 3. Apprendre des mois avec haute accuracy (juin: 82%)
> 4. Investissement estimé: $200K avec ROI en 6-8 mois
>
> **📊 Défi: Variabilité Mensuelle**
>
> **Observation:**
> - Port Time Savings varie de 9% (juillet) à 20% (juin)
> - Cette inconsistance complique la planification
> - Bunker Savings fluctue de $0.27M à $0.95M
>
> **Causes Possibles:**
> - Facteurs saisonniers (météo, volumes de shipping)
> - Différences dans composition du workload (liner mix)
> - Variations dans operational readiness
>
> **Actions:**
> 1. Standardiser les best practices de juin across tous les mois
> 2. Développer contingency plans pour les périodes difficiles
> 3. Analyser patterns saisonniers pour anticiper
>
> **💡 Opportunité Cachée: Terminal Benchmarking**
>
> **Constatation:**
> Avec 9 terminals, certains surperforment systématiquement. Exemple hypothétique:
> - Si Terminal A atteint 18% Port Time Savings
> - Et Terminal B seulement 12%
> - La gap de 6% représente millions en potential savings
>
> **Stratégie:**
> 1. Identifier le center of excellence terminal
> 2. Documenter leurs operational playbooks
> 3. Knowledge transfer workshops
> 4. Targeted investments dans terminals sous-performers
>
> **🌱 Forces à Maintenir:**
>
> 1. **Environmental Leadership:** 58.13K tonnes Carbon Abatement prouve l'engagement sustainability
> 2. **Financial ROI:** $5.55M Bunker Savings démontre value création
> 3. **Network Effect:** 9 terminals interconnectés permettent synergies
>
> **📈 Projection:**
>
> Si nous réussissons à:
> - Porter Arrival Accuracy à 85% consistent
> - Standardiser June-level efficiency (20% Port Time Savings)
> - Optimiser underperforming terminals
>
> **Potentiel additionnel:**
> - +$2-3M Bunker Savings annuellement
> - +15-20K tonnes Carbon Abatement
> - Meilleure satisfaction clients (liners)
> - Competitive advantage renforcé
>
> **Conclusion:**
> Le réseau PSA performe solidement (14% average Port Time Savings), mais June 2025 prouve que 20%+ est atteignable. Cette gap de 6% représente notre plus grande opportunité d'amélioration immédiate."

---

## Usage Tips

1. **Start Broad, Then Narrow**: Begin with network-wide view, then apply filters systematically
2. **Compare Contexts**: Always compare filtered results to overall network average for perspective
3. **Document Filter State**: Note which filters are active when sharing insights
4. **Take Screenshots**: Capture visuals to support data-driven recommendations
5. **Look for Patterns**: Monthly trends, seasonal variations, and correlations tell stories
6. **Translate to Action**: Every insight should lead to a decision or recommendation
7. **Combine Dimensions**: Most valuable insights come from multi-dimensional analysis (liner+service+port+time)
8. **Language Consistency**: When responding in non-English languages, keep metric names and codes in English for global consistency

---

**Document Version**: 1.1
**Last Updated**: October 2025 (Added multi-language support)
**Purpose**: PSA Codesprint Hackathon 2025 - Problem Statement 2
**Related**: psa-network-insights-agent-prompt.md, psa-network-insights-domain-knowledge.md
