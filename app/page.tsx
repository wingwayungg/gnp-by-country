import { Metadata } from "next";
import React, { Suspense } from "react";
import HomePageClient from "@components/home-page-client";
import { CountryType } from "@type/countryType";

async function fetchCountryGDP() {
    return fetch("https://api.worldbank.org/v2/country/all/indicator/SL.GDP.PCAP.EM.KD?format=json&date=2020&per_page=266", { cache: "force-cache" })
        .then((res) => res.json())
        .then(
            (data) =>
                data?.[1]
                    ?.slice(49)
                    ?.filter((o: CountryType) => o?.value) // get only countries that have GNP data
                    ?.map((o: CountryType) => ({ ...o, value: Math.trunc(o.value) })) as CountryType[] // truncate GDP value to integer
        )
        .catch(() => [] as CountryType[]); // in case of error when fetching the API // clear cache
}

export const metadata: Metadata = {
    title: "GNP per person",
    description: "List of GNP per person employed of each country in year 2020.",
};

export default async function Page() {
    const countryGDPData = await fetchCountryGDP();
    return (
        <div className="container py-5">
            <h1 className="my-0 my-md-5 text-center display-5 fw-bold">
                <span className="bg-gradient-primary">GNP per person employed</span>
                <span className="d-block fs-3 text-muted mt-2 fw-normal">(in USD, 2020)</span>
            </h1>
            <Suspense fallback={<div className="text-center p-5">Loading data...</div>}>
                <HomePageClient data={countryGDPData} />
            </Suspense>
        </div>
    );
}
