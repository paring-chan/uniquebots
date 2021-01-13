module.exports = {
    purge: ['./pages/**/*.tsx', './components/**/*.tsx', './types/**/*'],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                'discord-dark': '#2C2F33',
                'discord-black': '#23272A',
                'dark-hover': '#4f4f4f'
            },
        },
        minHeight: {
            '56': '14rem'
        }
    },
    variants: {
        extend: {},
    },
    plugins: [],
    important: true,
    whitelistPatterns: [/^bg-/, /^text-/],
}
