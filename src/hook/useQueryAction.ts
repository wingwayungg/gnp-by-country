import { useRouter } from "next/router";
import { FormType } from "@type/formType";
import { OrderByEnum } from "@type/sortType";

const useQueryAction = () => {
    const router = useRouter();
    const { pathname, query } = router;
    const isOrderAsc = query.orderAsc === "true";

    // change page
    const handlePageChange = (page: number) => router.push({ pathname, query: { ...query, page: page } }, undefined, { shallow: true });

    // reset form
    const handleReset = () => router.push(pathname, undefined, { shallow: true });

    // submit form
    const handleSubmit = (data: FormType) => {
        const dataToURL = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != ""));
        router.push({ pathname, query: { ...query, ...dataToURL, page: 1 } }, undefined, { shallow: true });
    };

    const sortLinkProp = (orderBy: `${OrderByEnum}`) => ({
        href: {
            pathname,
            query: { ...query, orderBy, orderAsc: !isOrderAsc, page: 1 },
        },
        shallow: true,
    });

    return { handlePageChange, handleReset, handleSubmit, sortLinkProp };
};
export default useQueryAction;
