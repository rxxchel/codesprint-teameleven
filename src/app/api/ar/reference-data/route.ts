import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "reference-sample-data.json",
    );
    const raw = await readFile(filePath, "utf-8");
    const payload = JSON.parse(raw);
    return NextResponse.json(payload, {
      headers: {
        "cache-control": "public, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[api/reference-data] failed to read data file", error);
    return NextResponse.json(
      { error: "Failed to load reference data." },
      { status: 500 },
    );
  }
}
