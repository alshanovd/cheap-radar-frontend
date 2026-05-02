"use client";

import { HeroUIProvider } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<I18nProvider locale="en-GB">
				<HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>
			</I18nProvider>
		</QueryClientProvider>
	);
}
