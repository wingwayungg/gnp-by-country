import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import Stack from "react-bootstrap/Stack";
import useQueryAction from "@hook/useQueryAction";
import { CountryType } from "@type/countryType";
import { OrderByEnum } from "@type/sortType";
import { CountryTableArrow } from "./CountryTableArrow";
import styles from "./CountryTable.module.scss";

interface CountryTableType {
    countries: CountryType[];
}

export const CountryTable: FC<CountryTableType> = ({ countries }) => {
    const { sortLinkProp } = useQueryAction();

    const button = (type: `${OrderByEnum}`, text: string) => (
        <Link {...sortLinkProp(type)}>
            <a className="d-flex">
                {text}
                <CountryTableArrow type={type} />
            </a>
        </Link>
    );

    return (
        <div className="overflow-scroll rounded-5 border border-2 rounded" style={{ height: 500 }}>
            <Stack className="justify-content-between px-3 py-3 border border-light border-2 rounded-3" direction="horizontal">
                {button("name", "Country Name")}
                {button("gnp", "GNP per Capital")}
            </Stack>
            {countries?.length ? (
                <>
                    {countries?.map((country, index) => (
                        <Stack className="px-3 py-3 border border-light border-2 rounded-3" direction="horizontal" key={index}>
                            <Image src={`https://countryflagsapi.com/svg/${country?.country?.id}`} alt="country flag" width={50} height={30} priority />
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
