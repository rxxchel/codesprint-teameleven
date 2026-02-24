# FishAI - PSA Network Insights AI Platform

**An AI-powered platform for analyzing PSA's global terminal network with real-time performance insights, 3D visualization, and voice-enabled interaction.**

---

## Quick Start

### Prerequisites

- **Node.js 18+** and **pnpm** (`npm install -g pnpm`)
- **Docker Desktop** (for database and containerized setup)
- **API Keys**: OpenAI 
- **PowerBI Credentials**: For PSA dashboard access
- **Mapbox Token**: For 3D network map

---

## Running the Project Locally

**Follow these steps to get FishAI running:**

### Step 1: Open Docker Desktop

Make sure Docker Desktop is running before proceeding.

### Step 2: Navigate to Project Folder

```bash
cd /path/to/codesprint-teameleven
```

### Step 3: Install Dependencies

```bash
pnpm install
```

### Step 4: Configure Environment Variables

Edit `docker/.env` with your credentials (see Environment Variables section below).

### Step 5: Start Playwright MCP Server (Terminal 1)

**Important:** Run this in a separate terminal window and keep it running. This is needed to configure the Playwright MCP server for PowerBI interaction (mentioned in Step 7).

```bash
npx @playwright/mcp@latest --port 8931 --host 0.0.0.0 --browser chromium --allowed-hosts '*' 
```

This starts the MCP server that enables the PSA Agent to interact with PowerBI dashboards.

### Step 6: Start Docker Compose (Terminal 2)

In a **new terminal window**, run:

```bash
docker compose -f docker/compose.yml up
```

This starts the Next.js application and PostgreSQL database.

### Step 7: Access the Application

Once both services are running:
1. **Open http://localhost:3000 in your browser**
2. **Create an account (email + password)**
3. **Set Up MCP Servers**:
   1. **Playwright MCP Server**
      1. Go to Settings → MCP Servers
      2. Add Playwright MCP server: `input the url obtained eg. {url:"http://host.docker.internal:8931/mcp"}`
      3. Save configuration
   2. **Notion MCP Server**
      1. Go to Settings → MCP Servers
      2. Add Notion MCP server
      3. Save configuration
  4. **Create a new Agent with PSA features enabled (PowerBI, 3D Map, Web Search)**
      1. Go to Agents → Create New Agent
      2. Agent Name: PSA Network Insights Agent
      3. Copy paste the prompt from `prompts/psa_network_insights_agent.txt` 
      4. Add all Notion tools, Playwright tools, and all App tools
      5. Save Agent
  5. **Start a conversation with the Agent**
      1. Go to Conversations → New Conversation
      2. Select the PSA Network Insights Agent
      3. Start chatting and exploring PSA's network insights!

**Note:** Keep both terminal windows running while using the application.

---

## Environment Variables

After running `pnpm install`, edit `docker/.env`  with these values:

### Required for Core Functionality

```env
# === LLM Provider ===
OPENAI_API_KEY=sk-proj-...
# Get your API key from: https://platform.openai.com/api-keys

# === Database (Auto-configured by Docker Compose) ===
# You need to set these in docker/.env:
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database_name
# Docker will automatically create the POSTGRES_URL from these
```

### Required for PSA Features

```env
# === PowerBI Integration (Required for PSA Agent) ===
POWERBI_CLIENT_ID=your_powerbi_client_id
POWERBI_CLIENT_SECRET=your_powerbi_client_secret
POWERBI_TENANT_ID=your_powerbi_tenant_id
POWERBI_WORKSPACE_ID=your_powerbi_workspace_id
POWERBI_REPORT_ID=your_powerbi_report_id
# Get these from your Azure Active Directory app registration

# === Mapbox (Required for 3D Network Map) ===
NEXT_PUBLIC_MAPBOX_TOKEN=
# Get your token from: https://account.mapbox.com/

# === Web Search ===
EXA_API_KEY=
```
---
