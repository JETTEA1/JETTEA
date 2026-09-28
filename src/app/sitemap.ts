import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jettea.ng";

  const routes = [
    "",
    "/shop",
    "/about",
    "/how-to-prepare",
    "/wholesale",
    "/faq",
    "/contact",
    "/order-lookup",
    "/delivery-policy",
    "/refund-policy",
    "/privacy-policy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/shop" ? "daily" : "monthly",
    priority: route === "" ? 1.0 : route === "/shop" || route === "/wholesale" ? 0.9 : 0.7,
  }));
}
