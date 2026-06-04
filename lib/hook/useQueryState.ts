import { useSearchParams } from "next/navigation";
import { OrderByEnum } from "@type/sortType";

const useQueryState = () => {
    const searchParams = useSearchParams();
    return {
        country: searchParams.get("country"),
        greaterThan: searchParams.get("greaterThan"),
        lessThan: searchParams.get("lessThan"),
        orderBy: searchParams.get("orderBy") as `${OrderByEnum}` | null,
        orderAsc: searchParams.get("orderAsc") === "true",
        page: Number(searchParams.get("page")) || 1,
    };
};

export default useQueryState;
