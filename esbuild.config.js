import dotenv from 'dotenv';
const keys = dotenv.config({ override: true }).parsed;
// get process values from .env file and use them in esbuild
const define = {};
Object.entries(keys).forEach(([key, value]) => {
	return define[`process.env.${key}`] = JSON.stringify(value);
})

export const buildConfig = (isDev) => ({
	ts: true,
	minify: isDev ? false : true,
	define
});