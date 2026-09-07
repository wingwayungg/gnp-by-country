import { Metadata } from "next";
import { Suspense } from "react";
import HomePageClient from "@components/HomePageClient";
import { PromptInput } from "@components/prompt/PromptInput";
import { fetchCountryGDP } from "@lib/countryData";

export const metadata: Metadata = {
    title: "GNP per person",
    description: "List of GNP per person employed of each country in year 2020.",
};

export default async function Page() {
    const countryGDPData = await fetchCountryGDP();
    return (
        <main className="container py-5">
            <h1 className="mt-0 mb-3 mt-md-5 mb-md-5 text-center display-5 fw-bold">
                <span className="bg-gradient-primary">GNP per person employed</span>
                <span className="d-block fs-3 text-muted mt-2 fw-normal">(in USD, 2020)</span>
            </h1>
            <PromptInput />
            <Suspense fallback={<div className="text-center p-5">Loading data...</div>}>
                <HomePageClient data={countryGDPData} />
            </Suspense>
        </main>
    );
}
