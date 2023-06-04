module.exports = {
    images: {
        // Dangerously Allow SVG to optimize images
        // Reference: https://nextjs.org/docs/api-reference/next/image#dangerously-allow-svg
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: "https",
                hostname: "flagsapi.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
};
