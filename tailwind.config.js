module.exports = {
    purge: [
        './resources/**/*.{js,jsx,ts,tsx}',
        './resources/**/*.blade.php',
    ],
    darkMode: 'media',
    theme: {
        extend: {
            colors: {
                'kelly-green': '#00AA65',
                'cheerful-green':'#76CC2B',
                'horizon-gray':'#F2F2F2',
                'midnight-gray':'#080D14',
            },
        },
    },
    variants: {
        extend: {
            backgroundColor: ['disabled'],
            cursor: ['disabled'],
            textColor: ['disabled'],
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
