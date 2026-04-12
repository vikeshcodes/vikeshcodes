import type { MetadataRoute } from "next";

import { getBlogs, getCatalogItems, getPortfolio, unwrapCollection } from "@/lib/api";

/**
 * Optimizes the sitemap for search engines by providing:
 * 1. Correct priority (importance of the page relative to others)
 * 2. Change frequency (hint to crawlers on how often to check back)
 * 3. Last modified date (to inform crawlers about fresh content)
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vikeshcodes.in";

  // Fetch all dynamic content groups in parallel
  const [blogsPayload, contentPayload, portfolioPayload] = await Promise.all([
    getBlogs().catch(() => []),
    getCatalogItems().catch(() => []),
    getPortfolio().catch(() => []),
  ]);

  const blogs = unwrapCollection(blogsPayload);
  const content = unwrapCollection(contentPayload);
  const portfolio = unwrapCollection(portfolioPayload);

  // 1. Static Core Routes
  const coreRoutes: MetadataRoute.Sitemap = [
    { url: `${base}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/blogs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/content`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/portfolio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/hire-me`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/work-with-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  // 2. Blog Post Routes
  const blogRoutes: MetadataRoute.Sitemap = blogs.map((item) => ({
    url: `${base}/blogs/${item.slug}`,
    lastModified: item.published_at ? new Date(item.published_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 3. Catalog/Content Routes
  const contentRoutes: MetadataRoute.Sitemap = content.map((item) => ({
    url: `${base}/content/${item.slug}`,
    lastModified: item.published_at ? new Date(item.published_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 4. Portfolio Project Routes
  const portfolioRoutes: MetadataRoute.Sitemap = portfolio.map((project) => ({
    url: `${base}/portfolio/${project.item.slug}`,
    lastModified: project.item.published_at ? new Date(project.item.published_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // 5. Legal Routes (Lower priority)
  const legalRoutes: MetadataRoute.Sitemap = [
    "/legal/privacy",
    "/legal/terms",
    "/legal/refund-policy",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [
    ...coreRoutes,
    ...blogRoutes,
    ...contentRoutes,
    ...portfolioRoutes,
    ...legalRoutes,
  ];
}

