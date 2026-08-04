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
                    "./app/*.{js,jsx,ts,tsx}",
                    "./components/**/*.{js,jsx,ts,tsx}",
                    "./node_modules/react-bootstrap/cjs/Button.js",
                    "./node_modules/react-bootstrap/cjs/PageItem.js",
                    "./node_modules/react-bootstrap/cjs/Pagination.js",
                    "./node_modules/react-bootstrap/cjs/Col.js",
                    "./node_modules/react-bootstrap/cjs/Row.js",
                    "./node_modules/react-bootstrap/cjs/Stack.js",
                    "./node_modules/react-bootstrap/esm/Button.js",
                    "./node_modules/react-bootstrap/esm/PageItem.js",
                    "./node_modules/react-bootstrap/esm/Pagination.js",
                    "./node_modules/react-bootstrap/esm/Col.js",
                    "./node_modules/react-bootstrap/esm/Row.js",
                    "./node_modules/react-bootstrap/esm/Stack.js",
                ],
                defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
                // react-bootstrap's Col builds classes like `col-md-6` via template-literal
                // concatenation (`${bsPrefix}${infix}-${span}`), so the literal string never
                // appears in Col.js for PurgeCSS's content scan to find — safelist exactly the
                // classes HomePageClient's <Col> props produce instead of scanning node_modules.
                safelist: {
                    standard: ["html", "body", "col-12", "col-md-6", "order-md-first"],
                },
            },
        ],
    ],
};
