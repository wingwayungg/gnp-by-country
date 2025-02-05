import Image from "next/legacy/image";
import React from "react";
import Stack from "react-bootstrap/Stack";
import { CountryType } from "@type/countryType";
import { CountryTableButton } from "./CountryTableButton";
import styles from "./CountryTable.module.scss";

interface CountryTableType {
    countries: CountryType[];
}

export const CountryTable = ({ countries }: CountryTableType) => {
    return (
        <div className="overflow-scroll rounded-3 border border-2 rounded" style={{ height: 500 }}>
            <Stack className="justify-content-between px-3 py-3 border border-light border-2 rounded-3" direction="horizontal">
                <CountryTableButton type="name" text="Country Name" />
                <CountryTableButton type="gnp" text="GNP per Capital" />
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
