"use client";

import { Button, DatePicker, Input } from "@heroui/react";
import { useState } from "react";

export default function Home() {
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [checksPerDay, setChecksPerDay] = useState("");

	const handleSearch = () => {
		// Add TanStack query routing or fetching here later
		console.log("Searching flights", { from, to, checksPerDay });
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
			<h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center">
				Find Your Next Flight
			</h1>

			<div className="w-full max-w-6xl p-6 bg-content1 rounded-2xl shadow-md flex flex-col lg:flex-row lg:flex-wrap gap-4 items-end">
				<Input
					label="From"
					placeholder="e.g. New York"
					value={from}
					onValueChange={setFrom}
					className="w-full lg:flex-1 lg:min-w-[160px]"
				/>
				<Input
					label="To"
					placeholder="e.g. London"
					value={to}
					onValueChange={setTo}
					className="w-full lg:flex-1 lg:min-w-[160px]"
				/>
				<DatePicker
					label="Date From"
					className="w-full lg:flex-1 lg:min-w-[140px]"
				/>
				<DatePicker
					label="Date To"
					className="w-full lg:flex-1 lg:min-w-[140px]"
				/>

				<Input
					type="number"
					label="Checks per day"
					placeholder="e.g. 5"
					value={checksPerDay}
					onValueChange={setChecksPerDay}
					min={1}
					className="w-full lg:flex-none lg:w-32"
				/>

				<Button
					color="primary"
					size="lg"
					className="w-full lg:flex-none lg:w-32 h-14"
					onPress={handleSearch}
				>
					Search
				</Button>
			</div>
		</div>
	);
}
