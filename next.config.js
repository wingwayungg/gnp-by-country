module.exports = {
    sassOptions: {
        quietDeps: true,
    },
    images: {
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
