import type { MetadataRoute } from "next";

import { getBlogs, getCatalogItems, getPortfolio, unwrapCollection } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [blogsPayload, contentPayload, portfolioPayload] = await Promise.all([
    getBlogs().catch(() => []),
    getCatalogItems().catch(() => []),
    getPortfolio().catch(() => []),
  ]);

  const routes: MetadataRoute.Sitemap = [
    "",
    "/blogs",
    "/content",
    "/portfolio",
    "/hire-me",
    "/work-with-us",
    "/legal/privacy",
    "/legal/terms",
    "/legal/refund-policy",
  ].map((path) => ({
    url: `${base}${path}`,
  }));

  return [
    ...routes,
    ...unwrapCollection(blogsPayload).map((item) => ({ url: `${base}/blogs/${item.slug}` })),
    ...unwrapCollection(contentPayload).map((item) => ({ url: `${base}/content/${item.slug}` })),
    ...unwrapCollection(portfolioPayload).map((project) => ({ url: `${base}/portfolio/${project.item.slug}` })),
  ];
}
