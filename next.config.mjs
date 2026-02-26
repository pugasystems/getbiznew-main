/** @type {import('next').NextConfig} */
const nextConfig = {
  // remove later
  typescript: {
    ignoreBuildErrors: true,
  },
  // upto here
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/bucket-c62877/**',
      },
    ],
  },
};

export default nextConfig;
