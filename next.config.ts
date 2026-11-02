import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Statik dışa aktarım: tüm sayfalar build anında üretilir (hızlı, SEO dostu, her yerde barındırılabilir).
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
