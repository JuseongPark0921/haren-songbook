/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/admin/auth", destination: "/api/songs/auth" },
        {
          source: "/archive-admin/auth",
          destination: "/api/archive/auth",
        },
        { source: "/archive-admin", destination: "/archive-admin/index.html" },
        { source: "/archive-admin/", destination: "/archive-admin/index.html" },
        { source: "/admin", destination: "/admin/index.html" },
        { source: "/admin/", destination: "/admin/index.html" },
      ],
    };
  },
};

export default nextConfig;
