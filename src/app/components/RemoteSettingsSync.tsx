"use client";

import { getSettings } from "@/app/api/settings";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export function RemoteSettingsSync() {
	const { setTheme } = useTheme();

	const { data, isPending } = useQuery({
		queryKey: ["settings"],
		queryFn: getSettings,
	});

	useEffect(() => {
		if (!data?.theme) return;
		if (data.theme === "dark" || data.theme === "light") {
			setTheme(data.theme);
		}
	}, [data?.theme, setTheme]);

	if (!isPending) return null;

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-background/70 backdrop-blur-sm"
			aria-busy="true"
			aria-live="polite"
		>
			<Spinner size="lg" label="Loading settings…" />
		</div>
	);
}
