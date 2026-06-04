import Image from "next/image";
import useQueryState from "@hook/useQueryState";
import { OrderByEnum } from "@type/sortType";

interface CountryTableArrowType {
    type: `${OrderByEnum}`;
}

export const CountryTableArrow = ({ type }: CountryTableArrowType) => {
    const { orderAsc, orderBy } = useQueryState();

    // Case 1 (default): when the url doesn't contain the orderBy parm, show the arrow is shown for Country Name '
    const showArrowCase1 = !orderBy && !orderAsc && type === OrderByEnum.gnp;
    // // Case 2 : when the url contains the orderBy parm, the arrow is shown according to the orderBy parm'
    const showArrowCase2 = orderBy === type;

    if (!showArrowCase1 && !showArrowCase2) return <></>;
    return <Image src="/images/arrow-up.svg" alt="me" width={14} height={14} {...(!orderAsc && { className: "rotate180" })} />;
};
