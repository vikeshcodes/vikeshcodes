import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SERVER_API_BASE_URL } from "@/lib/api";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vc_access")?.value;

  if (!token) {
    return NextResponse.json({ notifications: [], unread_count: 0 }, { status: 200 });
  }

  const upstream = await fetch(`${SERVER_API_BASE_URL}/api/v1/accounts/notifications/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!upstream.ok) {
    return NextResponse.json({ notifications: [], unread_count: 0 }, { status: upstream.status });
  }

  const data = await upstream.json();
  return NextResponse.json(data);
}
