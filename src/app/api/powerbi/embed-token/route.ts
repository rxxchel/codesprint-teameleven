import { ConfidentialClientApplication } from "@azure/msal-node";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientId = process.env.POWERBI_CLIENT_ID;
    const clientSecret = process.env.POWERBI_CLIENT_SECRET;
    const tenantId = process.env.POWERBI_TENANT_ID;
    const workspaceId = process.env.POWERBI_WORKSPACE_ID;
    const reportId = process.env.POWERBI_REPORT_ID;

    if (!clientId || !clientSecret || !tenantId || !workspaceId || !reportId) {
      return NextResponse.json(
        {
          error:
            "Power BI configuration is incomplete. Please check your environment variables.",
        },
        { status: 500 },
      );
    }

    // Configure MSAL for Service Principal authentication
    const msalConfig = {
      auth: {
        clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        clientSecret,
      },
    };

    const msalClient = new ConfidentialClientApplication(msalConfig);

    // Get access token
    const tokenResponse = await msalClient.acquireTokenByClientCredential({
      scopes: ["https://analysis.windows.net/powerbi/api/.default"],
    });

    if (!tokenResponse?.accessToken) {
      return NextResponse.json(
        { error: "Failed to acquire access token" },
        { status: 500 },
      );
    }

    // Get embed token from Power BI API
    const embedUrl = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;
    const generateTokenUrl = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`;

    // Generate embed token
    const generateTokenResponse = await fetch(generateTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenResponse.accessToken}`,
      },
      body: JSON.stringify({
        accessLevel: "View",
      }),
    });

    if (!generateTokenResponse.ok) {
      const errorText = await generateTokenResponse.text();
      return NextResponse.json(
        { error: `Failed to generate embed token: ${errorText}` },
        { status: generateTokenResponse.status },
      );
    }

    const embedTokenData = await generateTokenResponse.json();

    // Get report details
    const reportResponse = await fetch(embedUrl, {
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
      },
    });

    if (!reportResponse.ok) {
      const errorText = await reportResponse.text();
      return NextResponse.json(
        { error: `Failed to get report details: ${errorText}` },
        { status: reportResponse.status },
      );
    }

    const reportData = await reportResponse.json();

    return NextResponse.json({
      embedToken: embedTokenData.token,
      embedUrl: reportData.embedUrl,
      reportId: reportData.id,
      expiration: embedTokenData.expiration,
    });
  } catch (error) {
    console.error("Power BI embed token error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate embed token",
      },
      { status: 500 },
    );
  }
}
