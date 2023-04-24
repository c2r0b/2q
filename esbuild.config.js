import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const keys = dotenv.config({ override: true }).parsed;
// get process values from .env file and use them in esbuild
const define = {};
Object.entries(keys).forEach(([key, value]) => {
	return define[`process.env.${key}`] = JSON.stringify(value);
})

export const buildConfig = (isDev) => {
	return isDev ? {
		ts: true,
		tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
		define
	} : {
		tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
		minify: true,
		define
	};
};