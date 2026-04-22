import { NextResponse } from "next/server";
import { XApiStatementSchema } from "@/lib/xapi";
import { listStatements, recordStatement } from "@/lib/lrs-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(500, Number(url.searchParams.get("limit") ?? "100"));
  const statements = await listStatements(limit);
  return NextResponse.json({ version: "1.0.3", statements });
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

  const id = parsed.data.id ?? crypto.randomUUID();
  await recordStatement({ ...parsed.data, id });
  return NextResponse.json({ ok: true, id }, { status: 201 });
}
