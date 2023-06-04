import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
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

const queryReducer = (searchParams: ReadonlyURLSearchParams, action: ACTIONTYPE): URLSearchParams => {
    const { type, payload: { orderAsc, orderBy, page } = {} } = action;
    const params = new URLSearchParams(searchParams);
    switch (type) {
        case ACTIONS_QUERY.CHANGE_PAGE:
            params.set('page', page!.toString());
            return params;
        case ACTIONS_QUERY.RESET:
            params.delete('country');
            params.delete('greaterThan');
            params.delete('lessThan');
            return params;
        case ACTIONS_QUERY.SORT:
            if(orderBy) params.set('orderBy', orderBy as string);
            if(orderAsc?.toString()) params.set('orderAsc', orderAsc.toString());
            params.set('page', '1');
            return params;
        case ACTIONS_QUERY.SUBMIT:
            for (const [key, value] of Object.entries(action.payload!)) {
                if (value != "") {
                    params.set(key, value as string);
                } else {
                    params.delete(key);
                }
            }
            return params;
        default:
            return params;
    }
};

const useQueryAction = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const dispatchQuery = (action: ACTIONTYPE) => router.replace(`${pathname}?${queryReducer(searchParams, action).toString()}`);

    const sortLinkProp = (orderBy: `${OrderByEnum}`) => ({
        href: {
            pathname,
            query: Object.fromEntries(queryReducer(searchParams, { type: ACTIONS_QUERY.SORT, payload: { orderBy, orderAsc: searchParams.get('orderAsc') !== "true" } })),
        },
        shallow: true,
    });

    return { ACTIONS_QUERY, dispatchQuery, sortLinkProp };
};

export default useQueryAction;
