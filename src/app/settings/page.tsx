"use client";

import {
	getSettings,
	patchSettings,
	type RemoteSettings,
} from "@/app/api/settings";
import { Card, CardBody, Spinner, Switch } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function isResolvedTheme(t: string | undefined): t is "dark" | "light" {
	return t === "dark" || t === "light";
}

export default function Settings() {
	const queryClient = useQueryClient();
	const { theme, systemTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["settings"],
		queryFn: getSettings,
	});

	const updateSettings = useMutation({
		mutationFn: patchSettings,
		onSuccess: (serverData, variables) => {
			queryClient.setQueryData<RemoteSettings>(["settings"], (prev) => {
				if (serverData) {
					return { ...(prev ?? ({} as RemoteSettings)), ...serverData };
				}
				if (!prev) {
					return {
						currency: "USD",
						theme: variables.theme ?? "dark",
						notifications: variables.notifications ?? false,
					};
				}
				return { ...prev, ...variables };
			});
			const next = queryClient.getQueryData<RemoteSettings>(["settings"]);
			if (next && isResolvedTheme(next.theme)) {
				setTheme(next.theme);
			}
		},
	});

	const isDark =
		theme === "dark" || (theme === "system" && systemTheme === "dark");

	const patchPending = updateSettings.isPending;

	const darkModeSwitchSelected =
		!mounted
			? undefined
			: patchPending
				? isDark
				: isResolvedTheme(data?.theme)
					? data.theme === "dark"
					: isDark;

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap items-center gap-3">
				<h1 className="text-3xl font-bold">Settings</h1>
				{patchPending ? (
					<Spinner size="sm" color="primary" aria-label="Saving settings" />
				) : null}
			</div>

			{isError ? (
				<p className="text-sm text-danger" role="alert">
					{error instanceof Error ? error.message : "Failed to load settings"}
				</p>
			) : null}

			<div
				className="grid grid-cols-1 md:grid-cols-2 gap-4"
				aria-busy={patchPending}
			>
				<Card
					className={patchPending ? "opacity-60 pointer-events-none" : undefined}
				>
					<CardBody className="flex flex-row items-center justify-between p-6">
						<div>
							<h3 className="font-semibold text-lg">Email Notifications</h3>
							<p className="text-sm text-default-500">
								Get updates on your ongoing searches
							</p>
						</div>
						<Switch
							isSelected={Boolean(data?.notifications)}
							isDisabled={isLoading || !data || patchPending}
							onValueChange={(selected) => {
								updateSettings.mutate({ notifications: selected });
							}}
						/>
					</CardBody>
				</Card>

				<Card
					className={patchPending ? "opacity-60 pointer-events-none" : undefined}
				>
					<CardBody className="flex flex-row items-center justify-between p-6">
						<div>
							<h3 className="font-semibold text-lg">Dark Mode</h3>
							<p className="text-sm text-default-500">
								Managed via system preferences mostly
							</p>
						</div>
						<Switch
							color="secondary"
							isSelected={darkModeSwitchSelected}
							isDisabled={isLoading || !data || patchPending}
							onValueChange={(checked) => {
								const next = checked ? "dark" : "light";
								setTheme(next);
								updateSettings.mutate({ theme: next });
							}}
						/>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
