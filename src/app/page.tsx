"use client";

import { Button, DatePicker, Input } from "@heroui/react";
import { useState } from "react";

export default function Home() {
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");

	const handleSearch = () => {
		// Add TanStack query routing or fetching here later
		console.log("Searching flights", { from, to });
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
			<h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
				Find Your Next Flight
			</h1>

			<div className="w-full max-w-4xl p-6 bg-content1 rounded-2xl shadow-md flex flex-col md:flex-row gap-4">
				<Input
					label="From"
					placeholder="e.g. New York"
					value={from}
					onValueChange={setFrom}
					className="flex-1"
				/>
				<Input
					label="To"
					placeholder="e.g. London"
					value={to}
					onValueChange={setTo}
					className="flex-1"
				/>
				<DatePicker label="Date From" className="flex-1" />
				<DatePicker label="Date To" className="flex-1" />
				<Button
					color="primary"
					size="lg"
					className="md:self-center w-full md:w-auto h-14 px-8 mt-2 md:mt-0"
					onPress={handleSearch}
				>
					Search
				</Button>
			</div>
		</div>
	);
}
