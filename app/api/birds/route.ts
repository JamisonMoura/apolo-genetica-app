import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ birds: [], persistence: "localStorage" });
}

export async function PUT() {
  return NextResponse.json({ ok: true, persistence: "localStorage" });
}

export async function DELETE() {
  return NextResponse.json({ ok: true, persistence: "localStorage" });
}
