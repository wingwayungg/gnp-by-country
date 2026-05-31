"use client";

import { Col, Row } from "react-bootstrap";
import { CountryTable } from "@components/table/CountryTable";
import { PaginationComponent } from "@components/pagination/PaginationComponent";
import { FormComponent } from "@components/form/Form";
import useCountryFilterData from "@hook/useCountryFilterData";
import { CountryType } from "@type/countryType";

interface HomePageType {
    data: readonly CountryType[];
}

const HomePageClient = ({ data }: HomePageType) => {
    const { dataDisplayed, totalPage } = useCountryFilterData(data);
    return (
        <>
            <Row className="gap-3 gap-md-0 mb-3">
                <Col xs={12} md={6}>
                    <FormComponent />
                </Col>
                <Col xs={12} md={{ span: 6, order: "first" }}>
                    <CountryTable countries={dataDisplayed} />
                </Col>
            </Row>
            <PaginationComponent totalPage={totalPage} />
        </>
    );
};

export default HomePageClient;
