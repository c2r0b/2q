module.exports = {
	inject: false,
	plugins: [
			require("tailwindcss")('./tailwind.config.cjs'),
			require("autoprefixer")(),
			require("postcss-discard-comments")({ removeAll: true })
	]
};