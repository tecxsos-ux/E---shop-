/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['picsum.photos', 'cdn-icons-png.flaticon.com', 'lh3.googleusercontent.com', 'images.unsplash.com', 'e.pcloud.link'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ],
  },
  // Ensure we don't try to resolve the old pages directory if it conflicts
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};

module.exports = nextConfig;