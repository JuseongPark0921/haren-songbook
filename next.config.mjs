/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/archive-admin", destination: "/archive-admin/index.html" },
        { source: "/archive-admin/", destination: "/archive-admin/index.html" },
        { source: "/admin", destination: "/admin/index.html" },
        { source: "/admin/", destination: "/admin/index.html" },
      ],
    };
  },
};

export default nextConfig;
