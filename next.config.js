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
  basePath: process.env.NODE_ENV === 'production' ? '/filebind' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/filebind' : ''
}

module.exports = nextConfig