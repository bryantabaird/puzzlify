/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // next build would fail, suggestion here inspired by: https://github.com/aws/aws-sdk-js-v3/issues/6411
    serverComponentsExternalPackages: ['@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner']
  },
  images: {
    // TODO: Remove and replace with default puzzle piece image
    domains: ['picsum.photos'],
  },
};

export default nextConfig;
