import { GetStaticProps } from "next";
import Head from "next/head";
import _ from "lodash";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CountryTable } from "@components/table/CountryTable";
import { Pages } from "@components/pagination/Pages";
import { Form } from "@components/form/Form";
import useCountryFilterData from "@hook/useCountryFilterData";
import { CountryType } from "@type/countryType";

export default function Home({ data }: { data: CountryType[] }) {
    const { dataDisplayed, totalPage } = useCountryFilterData(data);
    return (
        <>
            <Head>
                <title>GDP per person employed</title>
                <meta name="description" content="List of GDP per person employed of each country in year 2020."></meta>
            </Head>
            <div className="px-5">
                <h1 className="my-2 my-md-3">GDP per person employed (in USD)</h1>
                <Row className="gap-3 gap-md-0 mb-3">
                    {/* <div className="col-12 col-md-6"><Form/></div> */}
                    <Col xs={12} md={6}>
                        <Form />
                    </Col>
                    {/* <div className="col-12 col-md-6 order-md-first"><CountryTable/></div> */}
                    <Col xs={12} md={{ span: 6, order: "first" }}>
                        <CountryTable countries={dataDisplayed} />
                    </Col>
                </Row>
                <Pages totalPage={totalPage} />
            </div>
        </>
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
