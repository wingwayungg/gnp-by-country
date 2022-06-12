import { useRouter } from "next/router";
import { ParsedUrlQueryInput } from "node:querystring";
import { FormType } from "@type/formType";
import { OrderByEnum } from "@type/sortType";

enum ACTIONS_QUERY {
    CHANGE_PAGE = "change-Page",
    RESET = "reset",
    SORT = "sort",
    SUBMIT = "submit",
}

type ACTIONTYPE = {
    type: ACTIONS_QUERY;
    payload?: {
        orderAsc?: boolean;
        orderBy?: `${OrderByEnum}`;
        page?: number;
    } & Partial<FormType>;
};

const useQueryAction = () => {
    const router = useRouter();
    const { pathname, query } = router;

    const queryReducer = (action: ACTIONTYPE): ParsedUrlQueryInput => {
        const { type, payload: { orderAsc, orderBy, page } = {} } = action;

        switch (type) {
            case ACTIONS_QUERY.CHANGE_PAGE:
                return { ...query, page };
            case ACTIONS_QUERY.RESET:
                return {};
            case ACTIONS_QUERY.SORT:
                return { ...query, orderBy, orderAsc, page: 1 };
            case ACTIONS_QUERY.SUBMIT:
                const dataToURL = Object.fromEntries(Object.entries(action.payload).filter(([_, v]) => v != ""));
                return { ...query, ...dataToURL, page: 1 };
            default:
                return query;
        }
    };

    const dispatchQuery = (action: ACTIONTYPE) => router.push({ pathname, query: queryReducer(action) }, undefined, { shallow: true });

    const sortLinkProp = (orderBy: `${OrderByEnum}`) => ({
        href: {
            pathname,
            query: queryReducer({ type: ACTIONS_QUERY.SORT, payload: { orderBy, orderAsc: query.orderAsc !== "true" } }),
        },
        shallow: true,
    });

    return { ACTIONS_QUERY, dispatchQuery, sortLinkProp };
};
export default useQueryAction;
