/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  basePath: (process.env.NODE_ENV !== "production" ? "" : "")
}

module.exports = nextConfig
