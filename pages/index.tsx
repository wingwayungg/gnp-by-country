import { GetStaticProps } from "next";
import { CountryType } from "@type/countryType";
import _ from "lodash";
import { CountryTable } from "@components/table/CountryTable";
import { Pages } from "@components/pagination/Pages";
import { Form } from "@components/form/Form";
import useCountryFilterData from "@hook/useCountryFilterData";

export default function Home({ data }: { data: CountryType[] }) {
    const { dataDisplayed, totalPage } = useCountryFilterData(data);
    return (
        <div className="px-5">
            <h1 className="my-2 my-md-3">GDP per person employed (in USD)</h1>
            <div className="d-flex flex-column flex-md-row gap-3">
                <div className="w-md-50 order-md-first order-last">
                    <CountryTable countries={dataDisplayed} />
                </div>
                <div className="w-md-50">
                    <Form />
                </div>
            </div>
            <div className="mt-3"></div>
            <Pages totalPage={totalPage} />
        </div>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const res = await fetch("https://api.worldbank.org/v2/country/all/indicator/SL.GDP.PCAP.EM.KD?format=json&date=2020&per_page=266");
    const resultArray = await res.json();
    return {
        props: {
            data: _.map(
                _.filter(_.slice(resultArray?.[1], 49), (o: CountryType) => o?.value), // get only the countries that have GNP data
                (o: CountryType) => ({ ...o, value: Math.trunc(o.value) }) // truncate GDP value to integer 
            ), 
        },
    };
};
