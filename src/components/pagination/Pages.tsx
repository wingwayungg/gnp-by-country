import { useState } from "react";
import { useRouter } from "next/router";
import Pagination from "react-bootstrap/Pagination";
import { useEffect } from "react";

export const Pages = ({ totalPage }) => {
    if (totalPage <= 1) return <></>;
    const router = useRouter();
    const currentPage = Number(router.query.page) || 1;
    // the page no. showed on the leftmost button
    const [leftMostPage, setLeftMostPage] = useState(currentPage);

    // onClick action to change page
    const moveToPage = (page: number) => router.push({ pathname: router.pathname, query: { ...router.query, page: page } }, undefined, { shallow: true });
    const paginationItem = (itemNo: number) => (
        <Pagination.Item onClick={() => moveToPage(itemNo)} active={currentPage == itemNo}>
            {itemNo}
        </Pagination.Item>
    );
    useEffect(() => {
        if (currentPage != leftMostPage && currentPage != leftMostPage + 1) setLeftMostPage(currentPage);
    }, [router]);
    return (
        <Pagination className="justify-content-center justify-content-md-start">
            <Pagination.First onClick={() => moveToPage(1)} disabled={currentPage == 1} />
            <Pagination.Prev
                onClick={() => {
                    moveToPage(currentPage - 1);
                }}
                disabled={currentPage == 1}
            />
            {leftMostPage < totalPage && paginationItem(leftMostPage)} 
            {leftMostPage + 1 < totalPage && paginationItem(leftMostPage + 1)}
            {leftMostPage + 2 < totalPage && <Pagination.Ellipsis disabled />}
            {paginationItem(totalPage)}
            <Pagination.Next
                onClick={() => {
                    moveToPage(currentPage + 1);
                }}
                disabled={currentPage == totalPage}
            />
            <Pagination.Last onClick={() => moveToPage(totalPage)} disabled={currentPage == totalPage} />
        </Pagination>
    );
};
