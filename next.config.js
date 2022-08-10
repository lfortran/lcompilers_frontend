/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: (process.env.NODE_ENV !== "production" ? "" : "")
}

module.exports = nextConfig
