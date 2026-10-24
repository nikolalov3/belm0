/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The old site lived at /visit/, /en/ etc. with trailing slashes; canonical, sitemap and IndexNow use them.
  trailingSlash: true,
  async rewrites() {
    return [
      // Survey answers go to our own domain and are proxied to the toodip collector,
      // so blockers of third-party stats scripts don't swallow them.
      { source: '/_s/c', destination: 'https://stats.toodip.com/api/collect' },
      { source: '/_s/c/', destination: 'https://stats.toodip.com/api/collect' },
      // Pages still served as static HTML from public/ (not ported to React yet).
      { source: '/visit/', destination: '/visit/index.html' },
      { source: '/visit/autumn/', destination: '/visit/autumn/index.html' },
    ];
  },
};

module.exports = nextConfig;
