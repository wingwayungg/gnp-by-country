import Image from "next/legacy/image";
import React, { FC } from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { useSearchParams } from "next/navigation";
import useQueryAction from "@hook/useQueryAction";
import { CountryType } from "@type/countryType";
import { OrderByEnum } from "@type/sortType";
import { CountryTableArrow } from "./CountryTableArrow";
import styles from "./CountryTable.module.scss";

interface CountryTableType {
    countries: CountryType[];
}

export const CountryTable: FC<CountryTableType> = ({ countries }) => {
    const { ACTIONS_QUERY, dispatchQuery } = useQueryAction();
    const searchParams = useSearchParams();

    const button = (type: `${OrderByEnum}`, text: string) => (
        <Button onClick={() => dispatchQuery({ type: ACTIONS_QUERY.SORT, payload: { orderBy: type, orderAsc: searchParams.get("orderAsc") !== "true" } })} size="sm" variant="primary" className="d-flex align-items-center">
            {text}
            <CountryTableArrow type={type} />
        </Button>
    );

    return (
        <div className="overflow-scroll rounded-3 border border-2 rounded" style={{ height: 500 }}>
            <Stack className="justify-content-between px-3 py-3 border border-light border-2 rounded-3" direction="horizontal">
                {button("name", "Country Name")}
                {button("gnp", "GNP per Capital")}
            </Stack>
            {countries?.length ? (
                <>
                    {countries?.map((country, index) => (
                        <Stack className="px-3 py-3 border border-light border-2 rounded-3" direction="horizontal" key={index}>
                            <Image src={`https://flagsapi.com/${country?.country?.id}/flat/64.png`} alt="country flag" width={50} height={50} priority />
                            <span className="ms-2 me-auto">{country?.country?.value}</span>
                            <span className={styles.tabularNumbersEqualWidth}>{country?.value ?? 0}</span>
                        </Stack>
                    ))}
                </>
            ) : (
                <div className="mt-5 text-center">No Result!</div>
            )}
        </div>
    );
};
