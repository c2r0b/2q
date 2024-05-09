import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// read package.json file
const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));

const keys = dotenv.config({ override: true }).parsed;
// get process values from .env file and use them in esbuild
const define = {
	'process.env.PACKAGE_VERSION': `"${packageJson.version}"`,
};
Object.entries(keys).forEach(([key, value]) => {
	return define[`process.env.${key}`] = JSON.stringify(value);
})

export const buildConfig = (isDev) => {
	return isDev ? {
		tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
		define
	} : {
		tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
		minify: true,
		define
	};
};