"use client";

import React from "react";
import { Col, Row } from "react-bootstrap";
import { CountryTable } from "@components/table/CountryTable";
import { PaginationComponent } from "@components/pagination/PaginationComponent";
import { FormComponent } from "@components/form/Form";
import useCountryFilterData from "@hook/useCountryFilterData";
import { CountryType } from "@type/countryType";

interface HomePageType {
    data: CountryType[];
}

export default function HomePageClient({ data }: Readonly<HomePageType>) {
    const { dataDisplayed, totalPage } = useCountryFilterData(data);
    return (
        <>
            <Row className="gap-3 gap-md-0 mb-3">
                {/* <div className="col-12 col-md-6"><Form/></div> */}
                <Col xs={12} md={6}>
                    <FormComponent />
                </Col>
                {/* <div className="col-12 col-md-6 order-md-first"><CountryTable/></div> */}
                <Col xs={12} md={{ span: 6, order: "first" }}>
                    <CountryTable countries={dataDisplayed} />
                </Col>
            </Row>
            <PaginationComponent totalPage={totalPage} />
        </>
    );
}
