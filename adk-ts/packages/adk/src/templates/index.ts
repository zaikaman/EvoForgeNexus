/**
 * Template Index
 * Exports all code generation templates
 */

export * from "./nextjs-app";
export * from "./react-components";
export * from "./api-routes";

/**
 * Template categories for easy access
 */
export const templates = {
	app: {
		nextjs: "nextjs-app",
	},
	components: {
		button: "button",
		card: "card",
		form: "form",
		modal: "modal",
		table: "table",
	},
	api: {
		get: "get",
		post: "post",
		crud: "crud",
		webhook: "webhook",
		upload: "upload",
		auth: "auth",
	},
};
