import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SERVER_API_BASE_URL, getViewerProfile } from "@/lib/api";

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("vc_access")?.value ?? null;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get("vc_refresh")?.value ?? null;
}

export async function refreshAccessToken() {
  const refresh = await getRefreshToken();
  if (!refresh) return null;
  const response = await fetch(`${SERVER_API_BASE_URL}/api/v1/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
    cache: "no-store",
  }).catch(() => null);
  if (!response?.ok) return null;
  const payload = (await response.json().catch(() => null)) as { access?: string } | null;
  return payload?.access ?? null;
}

export async function getViewer() {
  let token = await getAccessToken();
  if (!token) {
    return null;
  }

  try {
    return await getViewerProfile(token);
  } catch {
    token = await refreshAccessToken();
    if (!token) return null;
    try {
      return await getViewerProfile(token);
    } catch {
      return null;
    }
  }
}

export async function requireViewer(nextPath = "/dashboard") {
  const viewer = await getViewer();
  if (!viewer) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return viewer;
}
