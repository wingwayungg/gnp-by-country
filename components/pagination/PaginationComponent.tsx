import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";
import useQueryAction from "@hook/useQueryAction";

interface PaginationComponentType {
    totalPage: number;
}

export const PaginationComponent: FC<PaginationComponentType> = ({ totalPage }) => {
    if (totalPage <= 1) return <></>;

    const { ACTIONS_QUERY, dispatchQuery } = useQueryAction();
    const handlePageChange = (page: number) => dispatchQuery({ type: ACTIONS_QUERY.CHANGE_PAGE, payload: { page } });

    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    // the page no. showed on the leftmost button
    const [leftMostPage, setLeftMostPage] = useState(currentPage);

    const paginationItem = (itemNo: number) => (
        <Pagination.Item onClick={() => handlePageChange(itemNo)} active={currentPage === itemNo}>
            {itemNo}
        </Pagination.Item>
    );

    useEffect(() => {
        if (currentPage != leftMostPage && currentPage != leftMostPage + 1) setLeftMostPage(currentPage);
    }, [currentPage]);

    return (
        <Pagination className="justify-content-center justify-content-md-start">
            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage == 1} />
            <Pagination.Prev
                onClick={() => {
                    handlePageChange(currentPage - 1);
                }}
                disabled={currentPage == 1}
            />
            {leftMostPage < totalPage && paginationItem(leftMostPage)}
            {leftMostPage + 1 < totalPage && paginationItem(leftMostPage + 1)}
            {leftMostPage + 2 < totalPage && <Pagination.Ellipsis disabled />}
            {paginationItem(totalPage)}
            <Pagination.Next
                onClick={() => {
                    handlePageChange(currentPage + 1);
                }}
                disabled={currentPage == totalPage}
            />
            <Pagination.Last onClick={() => handlePageChange(totalPage)} disabled={currentPage == totalPage} />
        </Pagination>
    );
};
