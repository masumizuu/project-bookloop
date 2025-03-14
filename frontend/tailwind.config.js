/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                mn: ['Mansalva', 'sans-serif'],
                pd: ['Playfair Display', 'serif'],
            },
            colors: {
                brown: ['#55311c'],
                cream: ['#fcf9f3'],
                orange: ['#ffad60'],
                yellow: ['#ffeead'],
                green: ['#96ceb4'],
                darkBR: ['#3B1F11'],
            },
        },
    },
    plugins: [],
};