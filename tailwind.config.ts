import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class', // Manual toggling via class
    theme: {
        extend: {
            fontFamily: {
                serif: ['var(--font-playfair)', 'serif'],
                sans: ['var(--font-inter)', 'sans-serif'],
                mono: ['var(--font-roboto-mono)', 'monospace'],
            },
            colors: {
                // Brand Colors
                brand: {
                    DEFAULT: '#00D9A3',
                    muted: '#00C794',
                    dark: '#00B386'
                },
                // Light Mode (Landing)
                light: {
                    bg: '#E8E8E8',
                    card: '#FFFFFF',
                    text: '#1A1A1A',
                    secondary: '#666666'
                },
                // Dark Mode (Dashboard)
                dark: {
                    bg: '#13161F',
                    card: '#1E222E',
                    text: '#FFFFFF',
                    secondary: '#9CA3AF',
                    sidebar: '#17191F'
                }
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                'neon': '0 0 10px rgba(0, 212, 170, 0.5)',
            }
        },
    },
    plugins: [],
};
export default config;
