import { NextResponse } from "next/server";
import { XApiStatementSchema } from "@/lib/xapi";
import { listStatements, recordStatement } from "@/lib/lrs-store";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    version: "1.0.3",
    statements: listStatements().slice(0, 100),
  });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = XApiStatementSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid xAPI statement", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  recordStatement(parsed.data);
  return NextResponse.json(
    { ok: true, id: parsed.data.id ?? null },
    { status: 201 },
  );
}
