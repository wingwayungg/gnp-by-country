import Image from "next/image";
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
        <div className="card-premium h-100 bg-body p-0 overflow-hidden d-flex flex-column">
            <div className="d-flex flex-column" style={{ height: "500px" }}>
                <div className="bg-body-secondary p-3 border-bottom sticky-top">
                    <Stack className="justify-content-between" direction="horizontal">
                        <CountryTableButton type="name" text="Country Name" />
                        <div className="text-end">
                            <CountryTableButton type="gnp" text="GNP per Capita" />
                        </div>
                    </Stack>
                </div>

                <div className="overflow-auto flex-grow-1 p-2">
                    {countries?.length ? (
                        <div className="d-flex flex-column gap-2">
                            {countries?.map((country, index) => (
                                <div className="d-flex align-items-center p-3 rounded-3 bg-body border" key={index} style={{ transition: "background-color 0.2s" }}>
                                    <div className="flex-shrink-0">
                                        <Image src={`https://flagsapi.com/${country?.country?.id}/flat/64.png`} alt="country flag" width={48} height={48} className="rounded-2 shadow-sm" priority />
                                    </div>
                                    <span className="ms-3 fw-medium">{country?.country?.value}</span>
                                    <span className={`ms-auto fw-bold text-primary ${styles.tabularNumbersEqualWidth}`}>{country?.value ? `$${country.value.toLocaleString()}` : 0}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <p className="mb-0 fs-5">No countries found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
