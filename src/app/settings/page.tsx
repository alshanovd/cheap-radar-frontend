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
import { useEffect, useRef, useState } from "react";
import {
	getSettings,
	type RemoteSettings,
	updateSettings,
} from "@/app/api/settings";
import {
	DEFAULT_THEME,
	getStoredTheme,
	isTheme,
	saveTheme,
	THEMES,
	type Theme,
} from "@/app/theme";

export default function Settings() {
	const queryClient = useQueryClient();
	const [showSaved, setShowSaved] = useState(false);
	const [isSavedVisible, setIsSavedVisible] = useState(false);
	const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
	const savedShowFrame = useRef<number | null>(null);
	const savedHideTimer = useRef<number | null>(null);
	const savedRemoveTimer = useRef<number | null>(null);

	const { data, isLoading, isError } = useQuery({
		queryKey: ["settings"],
		queryFn: ({ signal }) => getSettings(signal),
	});

	useEffect(() => {
		setTheme(getStoredTheme());

		return () => {
			if (savedShowFrame.current)
				window.cancelAnimationFrame(savedShowFrame.current);
			if (savedHideTimer.current) window.clearTimeout(savedHideTimer.current);
			if (savedRemoveTimer.current)
				window.clearTimeout(savedRemoveTimer.current);
		};
	}, []);

	const showSavedNotice = () => {
		if (savedShowFrame.current)
			window.cancelAnimationFrame(savedShowFrame.current);
		if (savedHideTimer.current) window.clearTimeout(savedHideTimer.current);
		if (savedRemoveTimer.current) window.clearTimeout(savedRemoveTimer.current);

		setShowSaved(true);
		setIsSavedVisible(false);

		savedShowFrame.current = window.requestAnimationFrame(() => {
			setIsSavedVisible(true);
		});

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

	const controlsDisabled =
		isLoading || updateSettingsMutation.isPending || !data;

	const saveSettings = (settings: Partial<RemoteSettings>) => {
		const currentSettings =
			queryClient.getQueryData<RemoteSettings>(["settings"]) ?? data;

		if (!currentSettings) return;
		updateSettingsMutation.mutate({ ...currentSettings, ...settings });
	};

	const updateTheme = (nextTheme: Theme) => {
		setTheme(nextTheme);
		saveTheme(nextTheme);
		showSavedNotice();
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-3">
				<h1 className="text-3xl font-bold">Settings</h1>
				{showSaved && (
					<Chip
						color="success"
						variant="flat"
						className={`transition-opacity duration-500 ${
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
								saveSettings({ notifications });
							}}
						/>
					</CardBody>
				</Card>

				<Card>
					<CardBody className="p-6">
						<Select
							isDisabled={controlsDisabled}
							label="Currency"
							name="currency"
							selectedKeys={[data?.currency ?? "USD"]}
							onSelectionChange={(keys) => {
								if (keys === "all") return;
								const [currency] = Array.from(keys);

								if (!currency) return;
								saveSettings({ currency: String(currency) });
							}}
						>
							<SelectItem key="USD">USD</SelectItem>
							<SelectItem key="RUB">RUB</SelectItem>
						</Select>
					</CardBody>
				</Card>

				<Card>
					<CardBody className="p-6">
						<Select
							label="Theme"
							name="theme"
							selectedKeys={[theme]}
							onSelectionChange={(keys) => {
								if (keys === "all") return;
								const [selectedTheme] = Array.from(keys);
								const nextTheme = String(selectedTheme);

								if (!isTheme(nextTheme)) return;
								updateTheme(nextTheme);
							}}
						>
							{THEMES.map((availableTheme) => (
								<SelectItem key={availableTheme}>
									{availableTheme === "dark" ? "Dark" : "Light"}
								</SelectItem>
							))}
						</Select>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
