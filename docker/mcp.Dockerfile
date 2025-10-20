# Minimal wrapper that binds MCP to $PORT on Render
FROM docker.io/mcp/playwright:latest

WORKDIR /app

# Render sets PORT for web services; default to 8931 locally
ENV PORT=8931
ENV ALLOWED_HOSTS="*"

# IMPORTANT: clear the base image's ENTRYPOINT so our shell runs
ENTRYPOINT []

# Use shell-form CMD so $PORT/$ALLOWED_HOSTS are expanded by /bin/sh
# (Don't use -l; just -c is implied in shell form)
CMD npx @playwright/mcp@latest \
    --port "$PORT" \
    --host 0.0.0.0 \
    --browser chromium \
    --allowed-hosts "$ALLOWED_HOSTS" \
    --no-sandbox
