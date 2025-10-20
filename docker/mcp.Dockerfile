# docker/mcp.Dockerfile
FROM docker.io/mcp/playwright:latest
WORKDIR /app

# Render injects $PORT for web services; default to 8931 locally
ENV PORT=8931
ENV ALLOWED_HOSTS="*"

# Expose for local docs; Render doesn't rely on EXPOSE
EXPOSE 8931

# Start MCP bound to $PORT and respect ALLOWED_HOSTS
CMD sh -lc 'npx @playwright/mcp@latest \
    --port "$PORT" \
    --host 0.0.0.0 \
    --browser chromium \
    --allowed-hosts "$ALLOWED_HOSTS" \
    --no-sandbox'
