/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/filebinder' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/filebinder' : ''
}

module.exports = nextConfig