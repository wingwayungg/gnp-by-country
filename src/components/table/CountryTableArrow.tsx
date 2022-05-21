import { FC } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { OrderByEnum } from "@type/sortType";

interface CountryTableArrowType {
    type: `${OrderByEnum}`;
}

export const CountryTableArrow: FC<CountryTableArrowType> = ({ type }) => {
    const router = useRouter();
    const { orderAsc, orderBy } = router.query;

    // Case 1 (default): when the url doesn't contain the orderBy parm, show the arrow is shown for Country Name '
    const showArrowCase1 = !orderBy && !orderAsc && type === OrderByEnum.gnp;
    // Case 2 : when the url contains the orderBy parm, the arrow is shown according to the orderBy parm'
    const showArrowCase2 = orderBy === type;

    if (!showArrowCase1 && !showArrowCase2) return <></>;
    return <Image src="/images/arrow-up.svg" alt="me" width="20" height="30" className={orderAsc === "true" ? "" : "rotate180"} />;
};
