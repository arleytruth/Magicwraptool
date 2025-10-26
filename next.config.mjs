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
    output: 'standalone',
    eslint: {
        ignoreDuringBuilds: true, // Deployment hızlandırma (opsiyonel)
    },
    typescript: {
        ignoreBuildErrors: false, // Type hatalarını kontrol et
    },
};

export default nextConfig;
