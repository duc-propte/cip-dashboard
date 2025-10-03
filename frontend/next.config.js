/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Allow embedding in Salesforce iframes
        source: '/opportunity-profile/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.salesforce.com https://*.force.com https://*.my.salesforce.com",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

