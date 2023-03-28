module.exports = {
	inject: false,
	minify: true,
	plugins: [
		require("tailwindcss")('./tailwind.config.cjs'),
		require("autoprefixer")(),
		require("postcss-discard-comments")({ removeAll: true })
	]
};