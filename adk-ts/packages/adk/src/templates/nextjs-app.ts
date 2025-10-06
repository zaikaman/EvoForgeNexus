/**
 * Next.js App Template Generator
 * Provides templates for creating complete Next.js applications
 */

export interface NextJsAppConfig {
	name: string;
	description: string;
	features: string[];
	styling: "tailwind" | "css" | "styled-components";
	database?: "prisma" | "mongodb" | "none";
	auth?: "nextauth" | "clerk" | "none";
}

/**
 * Generate package.json for Next.js app
 */
export function generatePackageJson(config: NextJsAppConfig): string {
	const dependencies: Record<string, string> = {
		next: "^14.2.0",
		react: "^18.3.0",
		"react-dom": "^18.3.0",
	};

	const devDependencies: Record<string, string> = {
		"@types/node": "^20",
		"@types/react": "^18",
		"@types/react-dom": "^18",
		typescript: "^5",
	};

	// Add styling dependencies
	if (config.styling === "tailwind") {
		dependencies.tailwindcss = "^3.4.0";
		dependencies.autoprefixer = "^10.4.0";
		dependencies.postcss = "^8.4.0";
	}

	// Add database dependencies
	if (config.database === "prisma") {
		dependencies["@prisma/client"] = "^5.0.0";
		devDependencies.prisma = "^5.0.0";
	}

	// Add auth dependencies
	if (config.auth === "nextauth") {
		dependencies["next-auth"] = "^4.24.0";
	}

	return JSON.stringify(
		{
			name: config.name,
			version: "0.1.0",
			private: true,
			description: config.description,
			scripts: {
				dev: "next dev",
				build: "next build",
				start: "next start",
				lint: "next lint",
			},
			dependencies,
			devDependencies,
		},
		null,
		2,
	);
}

/**
 * Generate Next.js config
 */
export function generateNextConfig(): string {
	return `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
`;
}

/**
 * Generate TypeScript config
 */
export function generateTsConfig(): string {
	return `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`;
}

/**
 * Generate root layout
 */
export function generateRootLayout(config: NextJsAppConfig): string {
	const useTailwind = config.styling === "tailwind";

	return `import type { Metadata } from 'next';
${useTailwind ? "import './globals.css';" : ""}

export const metadata: Metadata = {
  title: '${config.name}',
  description: '${config.description}',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body${useTailwind ? " className='antialiased'" : ""}>{children}</body>
    </html>
  );
}
`;
}

/**
 * Generate home page
 */
export function generateHomePage(config: NextJsAppConfig): string {
	const useTailwind = config.styling === "tailwind";

	if (useTailwind) {
		return `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold mb-4">${config.name}</h1>
        <p className="text-xl text-gray-600 mb-8">${config.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${config.features
						.map(
							(feature) => `
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">${feature}</h3>
            <p className="text-gray-600">Feature implementation here</p>
          </div>`,
						)
						.join("")}
        </div>
      </div>
    </main>
  );
}
`;
	}

	return `export default function Home() {
  return (
    <main>
      <h1>${config.name}</h1>
      <p>${config.description}</p>
    </main>
  );
}
`;
}

/**
 * Generate Tailwind CSS config
 */
export function generateTailwindConfig(): string {
	return `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
`;
}

/**
 * Generate global CSS
 */
export function generateGlobalCss(): string {
	return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
`;
}

/**
 * Generate README
 */
export function generateReadme(config: NextJsAppConfig): string {
	return `# ${config.name}

${config.description}

## Features

${config.features.map((f) => `- ${f}`).join("\n")}

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
${config.styling === "tailwind" ? "- Tailwind CSS" : ""}
${config.database ? `- ${config.database}` : ""}
${config.auth ? `- ${config.auth}` : ""}

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy

Deploy this app to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
`;
}

/**
 * Generate complete Next.js app structure
 */
export function generateNextJsApp(config: NextJsAppConfig) {
	const files = [
		{
			path: "package.json",
			content: generatePackageJson(config),
			language: "json",
		},
		{
			path: "next.config.ts",
			content: generateNextConfig(),
			language: "typescript",
		},
		{
			path: "tsconfig.json",
			content: generateTsConfig(),
			language: "json",
		},
		{
			path: "app/layout.tsx",
			content: generateRootLayout(config),
			language: "typescript",
		},
		{
			path: "app/page.tsx",
			content: generateHomePage(config),
			language: "typescript",
		},
		{
			path: "README.md",
			content: generateReadme(config),
			language: "markdown",
		},
	];

	// Add Tailwind config if needed
	if (config.styling === "tailwind") {
		files.push(
			{
				path: "tailwind.config.ts",
				content: generateTailwindConfig(),
				language: "typescript",
			},
			{
				path: "app/globals.css",
				content: generateGlobalCss(),
				language: "css",
			},
		);
	}

	return {
		architecture: {
			name: config.name,
			description: config.description,
			techStack: [
				"Next.js 14",
				"React 18",
				"TypeScript",
				config.styling === "tailwind" ? "Tailwind CSS" : "",
				config.database || "",
				config.auth || "",
			].filter(Boolean),
			dependencies: JSON.parse(generatePackageJson(config)).dependencies,
		},
		files,
	};
}
