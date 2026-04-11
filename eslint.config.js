import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        console: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        window: "readonly",
        document: "readonly",
        CustomEvent: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        Math: "readonly",
        URLSearchParams: "readonly",
        HTMLInputElement: "readonly",
        HTMLTextAreaElement: "readonly",
        HTMLElement: "readonly",
        navigator: "readonly",
      },
    },
  },
];
