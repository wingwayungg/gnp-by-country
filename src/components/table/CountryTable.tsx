import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import Stack from "react-bootstrap/Stack";
import { Arrow } from "./Arrow";
import styles from "@styles/countryTable.module.scss";
import { CountryType } from "@type/countryType";
import { OrderByEnum } from "@type/sortType";

const myLoader = ({ src }) => `https://countryflagsapi.com/svg/${src}`;

interface CountryTableType {
    countries: CountryType[];
}

export const CountryTable: FC<CountryTableType> = ({ countries }) => {
    const router = useRouter();
    const orderAsc = router.query.orderAsc === "true";
    const button = (type: `${OrderByEnum}`, text: string) => (
        <Link
            href={{
                pathname: router.pathname,
                query: { ...router.query, orderBy: type, orderAsc: !orderAsc, page: 1 },
            }}
            shallow
        >
            <a className="d-flex">
                {text}
                <Arrow type={type} />
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
                        <Stack className="w-100 px-3 py-3 border border-light border-2 rounded-3" direction="horizontal" key={index}>
                            <Image loader={myLoader} src={country?.country?.id} alt="country flag" width={50} height={30} />
                            <span className="ms-2 me-auto">{country?.country?.value}</span>
                            <span className={`${styles.tabularNumbersEqualWidth}`}>{country?.value ?? 0}</span>
                        </Stack>
                    ))}
                </>
            ) : (
                <div className="mt-5 text-center">No Result!</div>
            )}
        </div>
    );
};
