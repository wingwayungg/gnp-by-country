"use client";

import Button from "react-bootstrap/Button";
import useQueryAction from "@hook/useQueryAction";
import useQueryState from "@hook/useQueryState";
import { OrderByEnum } from "@type/sortType";
import { CountryTableArrow } from "./CountryTableArrow";

interface CountryTableButtonType {
    type: `${OrderByEnum}`;
    text: string;
}

export const CountryTableButton = ({ type, text }: CountryTableButtonType) => {
    const { ACTIONS_QUERY, dispatchQuery } = useQueryAction();
    const { orderAsc } = useQueryState();
    return (
        <Button onClick={() => dispatchQuery({ type: ACTIONS_QUERY.SORT, payload: { orderBy: type, orderAsc: !orderAsc } })} size="sm" variant="link" className="d-flex align-items-center gap-2 btn-sort-gradient text-decoration-none rounded-2 px-3 py-1">
            {text}
            <CountryTableArrow type={type} />
        </Button>
    );
};
