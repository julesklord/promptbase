module.exports = [
    {
        files: ["js/*.js"],
        languageOptions: {
            sourceType: "module",
            globals: {
                window: "readonly",
                document: "readonly",
                localStorage: "readonly",
                CustomEvent: "readonly",
                URLSearchParams: "readonly",
                HTMLInputElement: "readonly",
                HTMLTextAreaElement: "readonly",
                HTMLElement: "readonly",
                navigator: "readonly",
                setTimeout: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly",
                console: "readonly",
                fetch: "readonly",
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
            "no-undef": "error",
            "no-unused-expressions": "error",
        },
    },
];
