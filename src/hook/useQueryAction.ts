import { useRouter } from "next/router";
import { ParsedUrlQueryInput } from "node:querystring";
import { FormType } from "@type/formType";
import { OrderByEnum } from "@type/sortType";

const useQueryAction = () => {
    const router = useRouter();
    const { pathname, query } = router;
    const isOrderAsc = query.orderAsc === "true";

    const routerPush = (customQuery?: ParsedUrlQueryInput) => router.push({ pathname, query: customQuery }, undefined, { shallow: true });

    // change page
    const handlePageChange = (page: number) => routerPush({ ...query, page: page });

    // reset form
    const handleReset = () => routerPush();

    // submit form
    const handleSubmit = (data: FormType) => {
        const dataToURL = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != ""));
        routerPush({ ...query, ...dataToURL, page: 1 });
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
