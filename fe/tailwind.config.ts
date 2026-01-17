import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class', // Forces dark mode to only activate with 'dark' class, effectively disabling system preference
    theme: {
        extend: {
            colors: {
                primary: "#ef4444",
                "primary-hover": "#dc2626",
            },
        },
    },
    plugins: [],
};
export default config;
