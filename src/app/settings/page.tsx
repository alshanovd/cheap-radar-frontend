"use client";

import {
	Card,
	CardBody,
	Chip,
	Select,
	SelectItem,
	Switch,
} from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import {
	getSettings,
	type RemoteSettings,
	updateSettings,
} from "@/app/api/settings";

export default function Settings() {
	const { theme, systemTheme, setTheme } = useTheme();
	const queryClient = useQueryClient();
	const [mounted, setMounted] = useState(false);
	const [showSaved, setShowSaved] = useState(false);
	const [isSavedVisible, setIsSavedVisible] = useState(false);
	const savedHideTimer = useRef<number | null>(null);
	const savedRemoveTimer = useRef<number | null>(null);

	useEffect(() => setMounted(true), []);

	const { data, isLoading, isError } = useQuery({
		queryKey: ["settings"],
		queryFn: getSettings,
	});

	useEffect(() => {
		if (mounted && data?.theme) {
			setTheme(data.theme);
		}
	}, [data?.theme, mounted, setTheme]);

	useEffect(() => {
		return () => {
			if (savedHideTimer.current) window.clearTimeout(savedHideTimer.current);
			if (savedRemoveTimer.current)
				window.clearTimeout(savedRemoveTimer.current);
		};
	}, []);

	const showSavedNotice = () => {
		if (savedHideTimer.current) window.clearTimeout(savedHideTimer.current);
		if (savedRemoveTimer.current) window.clearTimeout(savedRemoveTimer.current);

		setShowSaved(true);
		setIsSavedVisible(true);

		savedHideTimer.current = window.setTimeout(
			() => setIsSavedVisible(false),
			5000,
		);
		savedRemoveTimer.current = window.setTimeout(
			() => setShowSaved(false),
			5300,
		);
	};

	const updateSettingsMutation = useMutation({
		mutationFn: updateSettings,
		onSuccess: (settings) => {
			queryClient.setQueryData(["settings"], settings);
			showSavedNotice();
		},
	});

	const resolvedTheme = theme === "system" ? systemTheme : theme;
	const isDark = mounted && resolvedTheme === "dark";
	const controlsDisabled =
		isLoading || updateSettingsMutation.isPending || !data;

	const saveSettings = (settings: RemoteSettings) => {
		updateSettingsMutation.mutate(settings);
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-3">
				<h1 className="text-3xl font-bold">Settings</h1>
				{showSaved && (
					<Chip
						color="success"
						variant="flat"
						className={`transition-opacity duration-300 ${
							isSavedVisible ? "opacity-100" : "opacity-0"
						}`}
					>
						Settings Saved
					</Chip>
				)}
			</div>

			{isError && (
				<p className="text-sm text-danger">Error of retrieving settings data</p>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Card>
					<CardBody className="flex flex-row items-center justify-between p-6">
						<div>
							<h3 className="font-semibold text-lg">Email Notifications</h3>
							<p className="text-sm text-default-500">
								Get updates on your ongoing searches
							</p>
						</div>
						<Switch
							isDisabled={controlsDisabled}
							isSelected={data?.notifications ?? false}
							onValueChange={(notifications) => {
								if (!data) return;
								saveSettings({ ...data, notifications });
							}}
						/>
					</CardBody>
				</Card>

				<Card>
					<CardBody className="flex flex-row items-center justify-between p-6">
						<div>
							<h3 className="font-semibold text-lg">
								{isDark ? "Dark Mode" : "Light Mode"}
							</h3>
							<p className="text-sm text-default-500">
								Managed via system preferences mostly
							</p>
						</div>
						<Switch
							color="secondary"
							isDisabled={controlsDisabled || !mounted}
							isSelected={isDark}
							onValueChange={(checked) => {
								if (!data) return;
								const nextTheme = checked ? "dark" : "light";

								setTheme(nextTheme);
								saveSettings({ ...data, theme: nextTheme });
							}}
						/>
					</CardBody>
				</Card>

				<Card>
					<CardBody className="p-6">
						<Select
							isDisabled
							label="Currency"
							name="currency"
							selectedKeys={[data?.currency ?? "USD"]}
						>
							<SelectItem key="USD">USD</SelectItem>
						</Select>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
