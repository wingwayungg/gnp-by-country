module.exports = {
    plugins: [
        "postcss-flexbugs-fixes",
        [
            "postcss-preset-env",
            {
                autoprefixer: {
                    flexbox: "no-2009",
                },
                stage: 3,
                features: {
                    "custom-properties": false,
                },
            },
        ],
        [
            "@fullhuman/postcss-purgecss",
            {
                content: [
                    "./pages/**/*.{js,jsx,ts,tsx}",
                    "./src/**/**/*.{js,jsx,ts,tsx}",
                    "./node_modules/react-bootstrap/cjs/Button.js",
                    "./node_modules/react-bootstrap/cjs/PageItem.js",
                    "./node_modules/react-bootstrap/cjs/Pagination.js",
                    "./node_modules/react-bootstrap/cjs/Stack.js",
                    "./node_modules/react-bootstrap/cjs/Col.js",
                    "./node_modules/react-bootstrap/cjs/Row.js",
                    "./node_modules/react-bootstrap/esm/Button.js",
                    "./node_modules/react-bootstrap/esm/PageItem.js",
                    "./node_modules/react-bootstrap/esm/Pagination.js",
                    "./node_modules/react-bootstrap/esm/Stack.js",
                    "./node_modules/react-bootstrap/esm/Col.js",
                    "./node_modules/react-bootstrap/esm/Row.js",
                ],
                defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
                safelist: ["html", "body"],
            },
        ],
    ],
};
