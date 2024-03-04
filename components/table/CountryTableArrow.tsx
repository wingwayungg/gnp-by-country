import { FC } from "react";
import Image from "next/legacy/image";
import { useSearchParams } from "next/navigation";
import { OrderByEnum } from "@type/sortType";

interface CountryTableArrowType {
    type: `${OrderByEnum}`;
}

export const CountryTableArrow: FC<CountryTableArrowType> = ({ type }) => {
    const searchParams = useSearchParams();
    const orderAsc = searchParams.get("orderAsc");
    const orderBy = searchParams.get("orderBy");

    // Case 1 (default): when the url doesn't contain the orderBy parm, show the arrow is shown for Country Name '
    const showArrowCase1 = !orderBy && !orderAsc && type === OrderByEnum.gnp;
    // // Case 2 : when the url contains the orderBy parm, the arrow is shown according to the orderBy parm'
    const showArrowCase2 = orderBy === type;

    if (!showArrowCase1 && !showArrowCase2) return <></>;
    return <Image src="/images/arrow-up.svg" alt="me" width="27" height="27" className={orderAsc === "true" ? "" : "rotate180"} />;
};
