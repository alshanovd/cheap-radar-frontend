"use client";

import { FlightSearchForm } from "@/app/components/FlightSearchForm";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
			<h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center">
				Find Your Next Flight
			</h1>

			<FlightSearchForm />
		</div>
	);
}
