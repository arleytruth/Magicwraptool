/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.clerk.com",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "cdn.sanity.io",
            },
        ],
    },
    devIndicators: {
        position: 'bottom-right',
    },
    // Netlify için optimize edilmiş ayarlar
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    // macOS network hatası için
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
};

export default nextConfig;
