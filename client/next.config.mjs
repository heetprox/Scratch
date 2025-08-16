/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
        ],
        unoptimized: true
    },
    webpack: (config) => {
        // This is to handle ethers.js v6 properly
        config.resolve.fallback = { fs: false, net: false, tls: false };
        return config;
    },
    // Transpile ethers.js modules
    transpilePackages: ['ethers']
};

export default nextConfig;
