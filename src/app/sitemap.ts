import type { MetadataRoute } from "next";

const publicRoutes = [
  "",
  "/donate",
  "/sponsor",
  "/campaigns",
  "/events",
  "/impact",
  "/team",
  "/partners",
  "/volunteer",
  "/news",
  "/gallery",
  "/shop",
  "/contact"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://h2h.techsasaonline.com";
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));
}
