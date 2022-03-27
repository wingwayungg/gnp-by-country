import { FC } from "react";
import { CountryType } from "@type/countryType";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { Arrow } from "./Arrow";
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
        <div className="overflow-scroll rounded-5 border border-2 rounded" style={{ maxHeight: 500, minHeight: 300 }}>
            <div className="d-flex justify-content-between px-3 py-3 border border-light border-2 rounded-3" style={{ backgroundColor: "whitesmoke" }}>
                {button("name", "Country Name")}
                {button("gnp", "GNP per Capital")}
            </div>
            {countries.length ? (
                countries?.map((country: CountryType, index: number) => (
                    <div className="d-flex justify-content-between px-3 py-3 border border-light border-2 rounded-3" key={index}>
                        <div className="d-flex align-items-center">
                            <Image loader={myLoader} src={country?.country?.id} alt="Picture of the author" width={50} height={30} />
                            <span className="ps-2">{country?.country?.value}</span>
                        </div>
                        <span>{country?.value ?? 0}</span>
                    </div>
                ))
            ) : (
                <div className="mt-5 text-center">No Result!</div>
            )}
        </div>
    );
};
