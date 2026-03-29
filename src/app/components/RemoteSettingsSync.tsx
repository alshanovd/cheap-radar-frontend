"use client";

import { getSettings } from "@/app/api/settings";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export function RemoteSettingsSync() {
	const { setTheme } = useTheme();

	const { data } = useQuery({
		queryKey: ["settings"],
		queryFn: getSettings,
	});

	useEffect(() => {
		if (!data?.theme) return;
		if (data.theme === "dark" || data.theme === "light") {
			setTheme(data.theme);
		}
	}, [data?.theme, setTheme]);

	return null;
}
