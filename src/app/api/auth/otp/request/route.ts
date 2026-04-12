import { NextResponse } from "next/server";

import { SERVER_API_BASE_URL } from "@/lib/api";

export async function POST(request: Request) {
  const body = (await request.json()) as { email: string; purpose: string };

  const upstream = await fetch(
    `${SERVER_API_BASE_URL}/api/v1/accounts/otp/request/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, purpose: body.purpose }),
      cache: "no-store",
    },
  );

  const payload = await upstream.json().catch(() => ({}));
  return NextResponse.json(payload, { status: upstream.status });
}
