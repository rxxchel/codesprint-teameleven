"use client";

import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";
import { useEffect, useState } from "react";

interface EmbedConfig {
  embedToken: string;
  embedUrl: string;
  reportId: string;
  expiration: string;
}

export function PowerBIEmbedComponent() {
  const [embedConfig, setEmbedConfig] = useState<EmbedConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmbedToken() {
      try {
        const response = await fetch("/api/powerbi/embed-token");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch embed token");
        }

        const data = await response.json();
        setEmbedConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchEmbedToken();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Power BI dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="max-w-md rounded-lg border border-destructive bg-destructive/10 p-6">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Failed to load dashboard
          </h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-xs text-muted-foreground mt-4">
            Please check your Power BI configuration in the environment
            variables.
          </p>
        </div>
      </div>
    );
  }

  if (!embedConfig) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">
          No embed configuration available
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <PowerBIEmbed
        embedConfig={{
          type: "report",
          id: embedConfig.reportId,
          embedUrl: embedConfig.embedUrl,
          accessToken: embedConfig.embedToken,
          tokenType: models.TokenType.Embed,
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: true,
              },
            },
            background: models.BackgroundType.Transparent,
          },
        }}
        cssClassName="h-full w-full"
      />
    </div>
  );
}
