export const PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000";

export const SERVER_API_BASE_URL =
  process.env.API_INTERNAL_BASE_URL ??
  process.env.API_BASE_URL ??
  PUBLIC_API_BASE_URL;

type FetchOptions = RequestInit & {
  token?: string | null;
  revalidate?: number;
};

export interface CreatorProfile {
  id: string;
  display_name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  youtube_url: string;
  instagram_url: string;
  github_url: string;
  website_url: string;
  full_name: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface CatalogItemCard {
  id: string;
  title: string;
  slug: string;
  item_type: "blog" | "note" | "tutorial" | "course" | "portfolio";
  access_model: string;
  summary: string;
  subtitle: string;
  cover_image: string;
  price_inr: string;
  estimated_minutes: number;
  featured: boolean;
  published_at: string;
  categories: Category[];
  tags: Tag[];
}

export interface HomepageData {
  featured_items: CatalogItemCard[];
  latest_blogs: CatalogItemCard[];
  creator: CreatorProfile | null;
}

export interface BlogDetail extends CatalogItemCard {
  body: string;
  canonical_url: string;
  meta_title: string;
  meta_description: string;
}

export interface ContentDetail extends CatalogItemCard {
  preview: Record<string, unknown>;
  access: {
    has_access: boolean;
    price_inr: string;
    requires_purchase: boolean;
    viewer_token?: string | null;
  };
}

export interface PortfolioDetail {
  id: string;
  item: CatalogItemCard;
  client_name: string;
  industry: string;
  services: string;
  case_study_visible: boolean;
  case_study: string;
}

export interface Viewer {
  id: string;
  email: string;
  role: string;
  has_admin_access: boolean;
  display_name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  youtube_url: string;
  instagram_url: string;
  github_url: string;
  website_url: string;
  full_name: string;
  first_name: string;
  last_name: string;
}

export interface LibraryData {
  purchases: Array<{
    id: string;
    item_title: string;
    item_slug: string;
    item_type: string;
    cover_image: string;
    status: string;
    source: string;
    expires_at?: string | null;
    created_at: string;
  }>;
  subscriptions: Array<{
    id: string;
    plan_name: string;
    status: string;
    current_period_end?: string | null;
  }>;
  continue_learning?: {
    type: string;
    item_slug: string;
    title: string;
    chapter_slug?: string;
    lesson_slug?: string;
  } | null;
}

export interface AdminOverviewData {
  commerce: {
    total_users: number;
    revenue_total: string;
    paid_orders: number;
    active_subscriptions: number;
    recent_orders: Array<{
      id: string;
      status: string;
      order_type: string;
      total_amount: string;
      created_at: string;
      line_items: Array<{ title_snapshot: string }>;
    }>;
  };
  analytics: {
    funnel: {
      visitors_30d: number;
      signups_30d: number;
      purchases_30d: number;
    };
    retention: {
      retained_users_30d: number;
    };
    traffic_sources: Array<{ source: string; total: number }>;
    top_content: Array<{
      title: string;
      slug: string;
      item_type: string;
      view_count: number;
      purchase_count: number;
    }>;
  };
}

async function apiFetch<T>(
  path: string,
  { token, revalidate = 60, headers, ...init }: FetchOptions = {},
): Promise<T> {
  const response = await fetch(`${SERVER_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: init.cache ?? "force-cache",
    next: init.cache === "no-store" ? undefined : { revalidate },
  });

  if (!response.ok) {
    throw new Error(`API request failed for ${path}: ${response.status}`);
  }

  return (await response.json()) as T;
}

export const formatCurrency = (value: string | number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value));

export const unwrapCollection = <T>(payload: { results?: T[] } | T[]) =>
  Array.isArray(payload) ? payload : payload.results ?? [];

export async function getHomepageData() {
  return apiFetch<HomepageData>("/api/v1/catalog/homepage/");
}

export async function getCatalogItems() {
  return apiFetch<{ results?: CatalogItemCard[] } | CatalogItemCard[]>("/api/v1/catalog/content/");
}

export async function getBlogs() {
  return apiFetch<{ results?: CatalogItemCard[] } | CatalogItemCard[]>("/api/v1/catalog/blogs/");
}

export async function getBlog(slug: string) {
  return apiFetch<BlogDetail>(`/api/v1/catalog/blogs/${slug}/`, {
    revalidate: 30,
  });
}

export async function getContentDetail(slug: string, token?: string | null) {
  return apiFetch<ContentDetail>(`/api/v1/catalog/content/${slug}/`, {
    token,
    cache: token ? "no-store" : "force-cache",
    revalidate: token ? 0 : 30,
  });
}

export async function getSecureContentViewer(slug: string, viewerToken: string, token: string) {
  const encodedToken = encodeURIComponent(viewerToken);
  return apiFetch<Record<string, unknown>>(
    `/api/v1/catalog/content/${slug}/viewer/?token=${encodedToken}`,
    {
      token,
      cache: "no-store",
      revalidate: 0,
    },
  );
}

export async function getPortfolio() {
  return apiFetch<{ results?: PortfolioDetail[] } | PortfolioDetail[]>("/api/v1/catalog/portfolio/");
}

export async function getPortfolioProject(slug: string, token?: string | null) {
  return apiFetch<PortfolioDetail>(`/api/v1/catalog/portfolio/${slug}/`, {
    token,
    cache: token ? "no-store" : "force-cache",
    revalidate: token ? 0 : 30,
  });
}

export async function getViewerProfile(token: string) {
  return apiFetch<Viewer>("/api/v1/accounts/me/", {
    token,
    cache: "no-store",
    revalidate: 0,
  });
}

export async function getLibrary(token: string) {
  return apiFetch<LibraryData>("/api/v1/commerce/library/", {
    token,
    cache: "no-store",
    revalidate: 0,
  });
}

export async function getAdminOverview(token: string) {
  const [commerce, analytics] = await Promise.all([
    apiFetch<AdminOverviewData["commerce"]>("/api/v1/commerce/admin/overview/", {
      token,
      cache: "no-store",
      revalidate: 0,
    }),
    apiFetch<AdminOverviewData["analytics"]>("/api/v1/analytics/admin/overview/", {
      token,
      cache: "no-store",
      revalidate: 0,
    }),
  ]);

  return { commerce, analytics };
}
