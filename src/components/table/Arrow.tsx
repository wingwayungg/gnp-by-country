import { FC } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { OrderByEnum } from "@type/sortType";

interface ArrowType {
    type: `${OrderByEnum}`;
}

export const Arrow: FC<ArrowType> = ({ type }) => {
    const router = useRouter();
    const { orderAsc, orderBy } = router.query;
    if (!orderBy && !orderAsc && type === OrderByEnum.gnp) {
        return <Image src="/images/arrow-up.svg" alt="me" width="20" height="30" className="rotate180" />;
    } else if (orderBy != type) return <></>;
    return <Image src="/images/arrow-up.svg" alt="me" width="20" height="30" className={orderAsc === "true" ? "" : "rotate180"} />;
};
