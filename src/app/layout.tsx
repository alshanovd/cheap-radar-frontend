import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavigationNavbar } from "@/app/components/NavigationNavbar";
import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/app/theme";
import { Providers } from "./providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Flight Search Aggregator",
	description: "Scaffold frontend application for searching flight tickets",
};

const themeInitScript = `
(() => {
	try {
		const key = ${JSON.stringify(THEME_STORAGE_KEY)};
		const defaultTheme = ${JSON.stringify(DEFAULT_THEME)};
		const storedTheme = window.localStorage.getItem(key);
		const theme = storedTheme === "dark" || storedTheme === "light"
			? storedTheme
			: defaultTheme;

		if (storedTheme !== theme) {
			window.localStorage.setItem(key, theme);
		}

		document.documentElement.classList.toggle("dark", theme === "dark");
	} catch {
		document.documentElement.classList.add("dark");
	}
})();
`;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en-GB" className="dark" suppressHydrationWarning>
			<script
				// biome-ignore lint/security/noDangerouslySetInnerHtml: Applies stored theme before hydration to avoid a flash.
				dangerouslySetInnerHTML={{ __html: themeInitScript }}
			/>
			<body
				className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
			>
				<Providers>
					<NavigationNavbar />
					<main className="container mx-auto px-4 py-8 pb-16">{children}</main>
					<footer className="fixed inset-x-0 bottom-0 bg-background py-4 text-center text-sm text-default-500">
						© {new Date().getFullYear()} Cheap Radar
					</footer>
				</Providers>
			</body>
		</html>
	);
}
