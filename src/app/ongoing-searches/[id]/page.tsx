"use client";

import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	Spinner,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { use } from "react";

type FlightSearch = {
	id: string;
	company: string;
	datetime: string;
	price: string;
	link: string;
};

const fetchSingleSearch = async (id: string): Promise<FlightSearch> => {
	await new Promise((resolve) => setTimeout(resolve, 500));
	return {
		id,
		company: "Air Mock - " + id,
		datetime: "2026-05-01 12:00",
		price: "$" + (parseInt(id) * 100 + 50),
		link: "https://example.com/flight/" + id,
	};
};

export default function SingleOngoingSearch({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const resolvedParams = use(params);
	const id = resolvedParams.id;

	const { data, isLoading } = useQuery({
		queryKey: ["ongoing-search", id],
		queryFn: () => fetchSingleSearch(id),
	});

	return (
		<div className="flex flex-col gap-6 max-w-3xl mx-auto mt-8">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Search Details</h1>
				<Button as={Link} href="/ongoing-searches" variant="flat">
					Back to List
				</Button>
			</div>

			{isLoading ? (
				<div className="flex justify-center p-12">
					<Spinner size="lg" label="Loading search details..." />
				</div>
			) : data ? (
				<Card className="w-full">
					<CardHeader className="flex gap-3">
						<div className="flex flex-col">
							<p className="text-md font-bold uppercase tracking-wider">
								{data.company}
							</p>
							<p className="text-small text-default-500">ID: {data.id}</p>
						</div>
					</CardHeader>
					<Divider />
					<CardBody className="gap-4">
						<div className="flex justify-between border-b border-divider pb-2">
							<span className="text-default-500">Date / Time</span>
							<span className="font-medium">{data.datetime}</span>
						</div>
						<div className="flex justify-between border-b border-divider pb-2">
							<span className="text-default-500">Price</span>
							<span className="text-success font-bold text-lg">
								{data.price}
							</span>
						</div>
						<div className="flex justify-between items-center pt-2">
							<span className="text-default-500">Direct Link</span>
							<Button
								as={Link}
								href={data.link}
								target="_blank"
								color="primary"
								size="sm"
							>
								Book Now
							</Button>
						</div>
					</CardBody>
				</Card>
			) : (
				<p>No data found.</p>
			)}
		</div>
	);
}
