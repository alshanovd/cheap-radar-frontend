"use client";

import { Card, CardBody, Switch } from "@heroui/react";

export default function Settings() {
	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-3xl font-bold">Settings</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Card>
					<CardBody className="flex flex-row items-center justify-between p-6">
						<div>
							<h3 className="font-semibold text-lg">Email Notifications</h3>
							<p className="text-sm text-default-500">
								Get updates on your ongoing searches
							</p>
						</div>
						<Switch defaultSelected />
					</CardBody>
				</Card>

				<Card>
					<CardBody className="flex flex-row items-center justify-between p-6">
						<div>
							<h3 className="font-semibold text-lg">Dark Mode</h3>
							<p className="text-sm text-default-500">
								Managed via system preferences mostly
							</p>
						</div>
						<Switch defaultSelected color="secondary" />
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
