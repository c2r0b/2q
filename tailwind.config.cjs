module.exports = {
  content: ["./src/**/*.{html,js,ts}"],
  theme: {
    extend: {},
  },
  daisyui: {
    base: true,
    themes: ["lofi", "black"],
    utils: true,
    darkTheme: "black",
  },
  plugins: [require("daisyui")]
}
