"use client";

import { Button, Card, CardBody, Input } from "@heroui/react";
import { useMemo, useState } from "react";

const CREDITS_PER_USD = 100;
const INITIAL_USD = 10;
const PRESET_AMOUNTS = [10, 25, 50] as const;

const usdFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

const creditsFormatter = new Intl.NumberFormat("en-US", {
	maximumFractionDigits: 0,
});

function parseTopUp(raw: string): number | null {
	const n = Number.parseFloat(raw.trim());
	if (!Number.isFinite(n) || n <= 0) return null;
	return n;
}

export default function Billing() {
	const [balanceUsd, setBalanceUsd] = useState(INITIAL_USD);
	const [topUpInput, setTopUpInput] = useState("");

	const credits = useMemo(
		() => Math.round(balanceUsd * CREDITS_PER_USD),
		[balanceUsd],
	);

	const addUsd = (amount: number) => {
		if (!Number.isFinite(amount) || amount <= 0) return;
		setBalanceUsd((prev) => prev + amount);
	};

	const applyCustomTopUp = () => {
		const amount = parseTopUp(topUpInput);
		if (amount === null) return;
		addUsd(amount);
		setTopUpInput("");
	};

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-3xl font-bold">Billing</h1>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Card>
					<CardBody className="flex flex-col gap-4 p-6">
						<div>
							<h2 className="font-semibold text-lg">Current balance</h2>
							<p className="text-sm text-default-500">
								Mock balance for this session (resets on reload)
							</p>
						</div>
						<dl className="flex flex-col gap-2">
							<div className="flex justify-between gap-4">
								<dt className="text-default-600">USD</dt>
								<dd className="font-medium tabular-nums">
									{usdFormatter.format(balanceUsd)}
								</dd>
							</div>
							<div className="flex justify-between gap-4">
								<dt className="text-default-600">Credits</dt>
								<dd className="font-medium tabular-nums">
									{creditsFormatter.format(credits)}
								</dd>
							</div>
						</dl>
						<p className="text-xs text-default-500">
							1 USD = {CREDITS_PER_USD} credits
						</p>
					</CardBody>
				</Card>

				<Card>
					<CardBody className="flex flex-col gap-4 p-6">
						<div>
							<h2 className="font-semibold text-lg">Top up</h2>
							<p className="text-sm text-default-500">
								Add USD; credits update automatically
							</p>
						</div>
						<div className="flex flex-wrap gap-2">
							{PRESET_AMOUNTS.map((amount) => (
								<Button
									key={amount}
									size="sm"
									variant="flat"
									onPress={() => addUsd(amount)}
								>
									+{usdFormatter.format(amount)}
								</Button>
							))}
						</div>
						<Input
							label="Custom amount (USD)"
							placeholder="0.00"
							type="number"
							min={0}
							step="0.01"
							value={topUpInput}
							onValueChange={setTopUpInput}
							endContent={
								<span className="pointer-events-none text-default-400 text-sm">
									USD
								</span>
							}
						/>
						<Button color="primary" onPress={applyCustomTopUp}>
							Add to balance
						</Button>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
