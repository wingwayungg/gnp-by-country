import { GetStaticProps } from "next";
import { CountryType } from "@type/countryType";
import _ from "lodash";
import { CountryTable } from "@components/table/CountryTable";
import { Pages } from "@components/pagination/Pages";
import { Form } from "@components/form/Form";
import hook from "@hook/useCountryFilterData";

export default function Home({ data }: { data: CountryType[] }) {
    const { useCountryFilterData, showCurrentPage } = hook();
    const data_Total = useCountryFilterData(data);
    return (
        <div className="px-5">
            <h1 className="my-2 my-md-3">GNP by Country</h1>
            <div className="d-flex flex-column flex-md-row gap-3">
                <div className="w-md-50 order-md-first order-last">
                    <CountryTable countries={showCurrentPage(data_Total)} />
                </div>
                <div className="w-md-50">
                    <Form />
                </div>
            </div>
            <div className="mt-3"></div>
            <Pages totalPage={Math.ceil(data_Total?.length / 10)} />
        </div>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const res = await fetch("https://api.worldbank.org/v2/country/all/indicator/NY.GNP.PCAP.CD?format=json&date=2020&per_page=266");
    const resultArray = await res.json();
    return {
        props: {
            data: _.filter(_.slice(resultArray?.[1], 49), (o) => o?.value),
        },
    };
};
