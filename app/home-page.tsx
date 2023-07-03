"use client";

import React from "react";
import { Col, Row } from "react-bootstrap";
import { CountryTable } from "@components/table/CountryTable";
import { Pages } from "@components/pagination/Pages";
import { FormComponent } from "@components/form/Form";
import useCountryFilterData from "@hook/useCountryFilterData";

export default function HomePage({ data }) {
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
            <Pages totalPage={totalPage} />
        </>
    );
}
