"use client";

import React from "react";
import Button from "react-bootstrap/Button";
import { useSearchParams } from "next/navigation";
import useQueryAction from "@hook/useQueryAction";
import { OrderByEnum } from "@type/sortType";
import { CountryTableArrow } from "./CountryTableArrow";

interface CountryTableButtonType {
    type: `${OrderByEnum}`;
    text: string;
}

export const CountryTableButton = ({ type, text }: CountryTableButtonType) => {
    const { ACTIONS_QUERY, dispatchQuery } = useQueryAction();
    const searchParams = useSearchParams();
    return (
        <Button onClick={() => dispatchQuery({ type: ACTIONS_QUERY.SORT, payload: { orderBy: type, orderAsc: searchParams.get("orderAsc") !== "true" } })} size="sm" variant="primary" className="d-flex align-items-center">
            {text}
            <CountryTableArrow type={type} />{" "}
        </Button>
    );
};
