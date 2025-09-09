// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      gridTemplateColumns: {
        auto: 'repeat(auto-fit, minmax(200px, 1fr))',
      }
    },
  },
  content: ["./*.html"], // agregá esto para que Tailwind procese tu HTML
}
