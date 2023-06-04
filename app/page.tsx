import Head from "next/head";
import HomePage from "./home-page";
import { CountryType } from "@type/countryType";

export async function getData() {
    const resultArray = await fetch("https://api.worldbank.org/v2/country/all/indicator/SL.GDP.PCAP.EM.KD?format=json&date=2020&per_page=266").then((res) => res.json());
    return resultArray?.[1]
        ?.slice(49)
        ?.filter((o: CountryType) => o?.value) // get only countries that have GNP data
        ?.map((o: CountryType) => ({ ...o, value: Math.trunc(o.value) })); // truncate GDP value to integer
}

export default async function Page({ searchParams }) {
    const data = await getData();
    return (
        <>
            <Head>
                <title>GDP per person employed</title>
                <meta name="description" content="List of GDP per person employed of each country in year 2020."></meta>
            </Head>
            <div className="px-5">
                <h1 className="my-2 my-md-3">GDP per person employed (in USD)</h1>
                <HomePage data={data} />
            </div>
        </>
    );
}
