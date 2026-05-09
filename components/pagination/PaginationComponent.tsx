import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Pagination from "react-bootstrap/Pagination";
import useQueryAction from "@hook/useQueryAction";

interface PaginationComponentType {
    totalPage: number;
}

export const PaginationComponent = ({ totalPage }: PaginationComponentType) => {
    const { ACTIONS_QUERY, dispatchQuery } = useQueryAction();
    const handlePageChange = (page: number) => dispatchQuery({ type: ACTIONS_QUERY.CHANGE_PAGE, payload: { page } });

    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    // the page no. showed on the leftmost button
    const [leftMostPage, setLeftMostPage] = useState(currentPage);
    // tracks the currentPage this render is adjusting leftMostPage for, so the reset below runs once per page change instead of looping
    const [adjustedForPage, setAdjustedForPage] = useState(currentPage);
    if (currentPage !== adjustedForPage) {
        setAdjustedForPage(currentPage);
        if (currentPage != leftMostPage && currentPage != leftMostPage + 1) setLeftMostPage(currentPage);
    }

    const paginationItem = (itemNo: number) => (
        <Pagination.Item onClick={() => handlePageChange(itemNo)} active={currentPage === itemNo}>
            {itemNo}
        </Pagination.Item>
    );

    if (totalPage <= 1) return <></>;

    return (
        <div className="d-flex justify-content-center mt-4">
            <Pagination className="gap-1">
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
        </div>
    );
};
