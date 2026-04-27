import { LookupDetails } from "@/app/components/LookupDetails";

export default function SingleLookup({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	return <LookupDetails params={params} />;
}
