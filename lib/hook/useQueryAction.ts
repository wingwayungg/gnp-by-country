import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { FormType } from "@type/formType";
import { OrderByEnum } from "@type/sortType";

enum ACTIONS_QUERY {
    CHANGE_PAGE = "change-Page",
    RESET = "reset",
    SORT = "sort",
    SUBMIT = "submit",
}

type ActionType = {
    type: ACTIONS_QUERY;
    payload?: {
        orderAsc?: boolean;
        orderBy?: `${OrderByEnum}`;
        page?: number;
    } & Partial<FormType>;
};

const queryReducer = (searchParams: ReadonlyURLSearchParams, action: ActionType): URLSearchParams => {
    const { type, payload: { orderAsc, orderBy, page } = {} } = action;
    const params = new URLSearchParams(searchParams.toString());
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
    const searchParams = useSearchParams();

    const dispatchQuery = (action: ActionType) => window.history.pushState(null, '', `?${queryReducer(searchParams, action).toString()}`);

    return { ACTIONS_QUERY, dispatchQuery };
};

export default useQueryAction;
