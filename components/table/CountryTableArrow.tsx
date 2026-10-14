import Image from "next/image";
import useQueryState from "@hook/useQueryState";
import { OrderBy } from "@type/sortType";

interface CountryTableArrowType {
    type: OrderBy;
}

export const CountryTableArrow = ({ type }: CountryTableArrowType) => {
    const { orderAsc, orderBy } = useQueryState();

    // Case 1 (default): when the url doesn't contain the orderBy param, the data is sorted by GNP descending, so the arrow is shown for GNP
    const showArrowCase1 = !orderBy && !orderAsc && type === "gnp";
    // Case 2 : when the url contains the orderBy param, the arrow is shown according to the orderBy param
    const showArrowCase2 = orderBy === type;

    if (!showArrowCase1 && !showArrowCase2) return null;
    return <Image src="/images/arrow-up.svg" alt="arrow" width={14} height={14} unoptimized {...(!orderAsc && { className: "rotate180" })} />;
};
