/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        // The jazzyvault-files bucket is private (see backend migration
        // 002_files.sql), so files are served via signed URLs under
        // /storage/v1/object/sign/**, not the /public/** path that's
        // only valid for public buckets. This pattern wasn't actually
        // exercised anywhere yet — every Supabase-hosted file preview
        // in the app correctly uses a plain <img> tag instead of
        // next/image, since signed URLs are short-lived and per-request,
        // which next/image's optimizer/caching isn't a good fit for.
        // Kept here, corrected, in case a future phase adds an
        // next/image-based preview (e.g. thumbnails) that needs it.
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
