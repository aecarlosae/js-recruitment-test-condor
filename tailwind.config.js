module.exports = {
  purge: {
    enabled: true,
    mode: 'all',
    preserveHtmlElements: false,
    content: ['./index.html'],
    options: {
      keyframes: true,
    }
  },

  darkMode: 'media',

  theme: {
    extend: {},
    screens: {
      'xs': '475px',      
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },

  variants: {
    extend: {},
  },

  plugins: [],
  
  corePlugins: {
    animation: false,
  }
}
