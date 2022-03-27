import { useState } from "react";
import { useRouter } from "next/router";
import Pagination from "react-bootstrap/Pagination";
import { useEffect } from "react";

export const Pages = ({ totalPage }) => {
    if (totalPage <= 1) return <></>;
    const router = useRouter();
    const currentPage = Number(router.query.page) || 1;
    const [leftMostPageIndex, setLeftMostPageIndex] = useState(currentPage);
    const moveToPage = (page: number) => router.push({ pathname: router.pathname, query: { ...router.query, page: page } });
    const paginationItem = (itemNo: number) => (
        <Pagination.Item onClick={() => moveToPage(itemNo)} active={currentPage == itemNo}>
            {itemNo}
        </Pagination.Item>
    );
    useEffect(() => {
        if (currentPage != leftMostPageIndex && currentPage != leftMostPageIndex + 1) setLeftMostPageIndex(currentPage);
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
            {currentPage != totalPage && paginationItem(leftMostPageIndex)}
            {currentPage < totalPage - 1 && paginationItem(leftMostPageIndex + 1)}
            {currentPage < totalPage - 1 && <Pagination.Ellipsis disabled />}
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
