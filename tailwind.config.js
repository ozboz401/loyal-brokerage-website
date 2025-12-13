/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            animation: {
                'gradient-x': 'gradient-x 8s ease infinite',
            }
        },
    },
    plugins: [],
}
