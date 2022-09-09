/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: (process.env.MY_ENV !== "production" ? "/pull_request_preview" : "")
}

module.exports = nextConfig
