# PSA Network Insights AI Agent - Prompt Documentation

This folder contains the prompt engineering documentation and configuration for the PSA Network Insights Conversational AI Agent.

## 📁 Contents

### Core Prompt Files

1. **`psa-network-insights-agent-prompt.md`**
   - Main system prompt for the AI agent
   - Defines the agent's role, capabilities, and behavior
   - Includes multi-language support guidelines (EN, KO, JA, ZH, ES, FR)
   - Contains Power BI dashboard interaction instructions
   - Specifies filter interaction patterns and rules

2. **`psa-network-insights-domain-knowledge.md`**
   - Comprehensive reference guide for PSA metrics and terminology
   - Metric definitions and calculations
   - Liner codes, service codes, and node identifiers
   - Data structure and relationships
   - Business context and interpretation guidelines

3. **`psa-network-insights-example-prompts.md`**
   - 50+ example user questions
   - Organized by query type:
     - Simple metric queries
     - Trend analysis
     - Comparative analysis
     - Filter-based queries
     - Multi-language examples
   - Use cases for testing and validation

4. **`user-dashboard-guide.md`**
   - User-friendly explanation of the dashboard
   - Non-technical guide for business users
   - Explains what metrics mean in business context
   - How to interpret visualizations

## 🎯 Purpose

These prompts enable an AI agent to:
- Interpret PSA's Global Network Insights Power BI dashboard
- Answer questions about port performance metrics
- Provide trend analysis and insights
- Support multiple languages for global teams
- Interact with dashboard filters programmatically
- Deliver actionable recommendations

## 🌐 Supported Languages

The agent can respond in:
- 🇺🇸 English (en) - Default
- 🇰🇷 Korean (ko) - 한국어
- 🇯🇵 Japanese (ja) - 日本語
- 🇨🇳 Chinese (zh) - 中文
- 🇪🇸 Spanish (es) - Español
- 🇫🇷 French (fr) - Français

## 📊 Metrics Covered

- **Port Time Savings** - Processing time improvement vs baseline
- **Bunker Savings** - Fuel cost savings in USD
- **Carbon Abatement** - CO2 emissions prevented (tonnes)
- **Arrival Accuracy** - Percentage of vessels arriving within predicted window
- **Port Calls** - Number of vessel visits
- **Average Berth Time** - Time vessels spend at berth

## 🏗️ Integration

### How to Use These Prompts

1. **System Prompt Integration:**
   - Use `psa-network-insights-agent-prompt.md` as the system prompt
   - Inject domain knowledge from `psa-network-insights-domain-knowledge.md` as context when needed

2. **RAG (Retrieval-Augmented Generation):**
   - Index domain knowledge for semantic search
   - Retrieve relevant context based on user queries

3. **Testing:**
   - Use examples from `psa-network-insights-example-prompts.md` for validation
   - Ensure the agent responds accurately to various query types

### Requirements

- **AI Model:** Claude 3.5 Sonnet or similar (recommended)
- **Power BI Integration:** Browser automation (Playwright MCP) for dashboard interaction
- **Multi-language Support:** Model must support multilingual responses

## 🔧 Customization

### Adapting for Your Use Case

1. **Metric Definitions:**
   - Update metric calculations in `psa-network-insights-domain-knowledge.md`
   - Add new metrics as needed

2. **Language Support:**
   - Add translation examples to `psa-network-insights-agent-prompt.md`
   - Include language-specific terminology

3. **Dashboard Integration:**
   - Modify filter interaction patterns based on your dashboard structure
   - Update element selectors if dashboard UI changes

## 📝 Example Usage

### Simple Query
```
User: "What was the bunker savings for Singapore in June?"
Agent: Interprets dashboard, applies filters, returns specific value
```

### Trend Analysis
```
User: "Show me the port time savings trend for Q2 2025"
Agent: Analyzes data across April-June, identifies patterns, provides insights
```

### Comparative Analysis
```
User: "Compare BUSAN and JAKARTA performance"
Agent: Pulls metrics for both ports, highlights differences, recommends actions
```

### Multi-language
```
User: "부산 항구 성과 분석해줘" (Korean)
Agent: Responds in Korean with Busan port analysis
```

## 🚀 Getting Started

1. **Read the Agent Prompt:**
   - Start with `psa-network-insights-agent-prompt.md`
   - Understand the agent's role and capabilities

2. **Explore Domain Knowledge:**
   - Review `psa-network-insights-domain-knowledge.md`
   - Familiarize yourself with metrics and terminology

3. **Try Example Prompts:**
   - Test queries from `psa-network-insights-example-prompts.md`
   - Validate agent responses

4. **Customize:**
   - Adapt prompts for your specific dashboard and metrics
   - Add organization-specific context

## 📚 Best Practices

1. **Context Window Management:**
   - Domain knowledge is extensive (~4000 lines)
   - Use RAG to inject only relevant sections
   - Don't load entire domain knowledge unless necessary

2. **Filter Isolation:**
   - Agent must clear existing filters before applying new ones
   - Prevents unexpected filter combinations

3. **Metric Interpretation:**
   - Always provide business context with numbers
   - Explain what metrics mean for operations

4. **Multi-language Consistency:**
   - Keep technical terms in English across languages
   - Maintain professional tone in all languages

## 🔍 Troubleshooting

**Issue: Agent doesn't understand metric names**
- Check domain knowledge is properly injected
- Verify metric names match dashboard exactly

**Issue: Filter interactions fail**
- Update element selectors in agent prompt
- Verify dashboard structure hasn't changed

**Issue: Multi-language responses in wrong language**
- Ensure user preference/locale is passed to agent
- Check language detection logic

## 🎓 Training & Onboarding

For new team members:

1. Read `user-dashboard-guide.md` first (non-technical introduction)
2. Explore `psa-network-insights-example-prompts.md` (use cases)
3. Study `psa-network-insights-domain-knowledge.md` (technical details)
4. Review `psa-network-insights-agent-prompt.md` (system behavior)

## 📄 License

This documentation is part of the PSA Codesprint 2025 - Problem Statement 2 project.

## 🤝 Contributing

To improve these prompts:

1. Test with real user queries
2. Document edge cases
3. Update domain knowledge as metrics change
4. Add new example prompts
5. Expand language support

---

**Last Updated:** October 2025
**Version:** 1.0
**Maintained by:** Team Eleven
