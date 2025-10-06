import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
	},
	format: ["cjs", "esm"],
	dts: false,
	splitting: true,
	clean: true,
});
