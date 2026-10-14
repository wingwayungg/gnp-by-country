import { useSearchParams } from "next/navigation";
import { OrderBy } from "@type/sortType";

const toNumber = (value: string | null) => (value === null ? null : Number(value));

const useQueryState = () => {
    const searchParams = useSearchParams();
    return {
        country: searchParams.get("country"),
        greaterThan: toNumber(searchParams.get("greaterThan")),
        lessThan: toNumber(searchParams.get("lessThan")),
        orderBy: searchParams.get("orderBy") as OrderBy | null,
        orderAsc: searchParams.get("orderAsc") === "true",
        page: Number(searchParams.get("page")) || 1,
    };
};

export default useQueryState;
