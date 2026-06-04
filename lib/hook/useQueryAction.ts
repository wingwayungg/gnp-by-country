import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
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
    } | {
        page?: number;
    } | FormData;
};

const queryReducer = (searchParams: ReadonlyURLSearchParams, action: ActionType): URLSearchParams => {
    const { type, payload = {} } = action;
    const params = new URLSearchParams(searchParams.toString());
    switch (type) {
        case ACTIONS_QUERY.CHANGE_PAGE:
            const { page } = payload as Extract<ActionType['payload'], {
                page?: number;
            }>;
            params.set('page', page!.toString());
            return params;
        case ACTIONS_QUERY.RESET:
            params.delete('country');
            params.delete('greaterThan');
            params.delete('lessThan');
            return params;
        case ACTIONS_QUERY.SORT:
            const { orderAsc, orderBy } = payload as Extract<ActionType['payload'], {
                orderAsc?: boolean;
                orderBy?: `${OrderByEnum}`;
            }>
            if(orderBy) params.set('orderBy', orderBy as string);
            if(orderAsc?.toString()) params.set('orderAsc', orderAsc.toString());
            params.set('page', '1');
            return params;
        case ACTIONS_QUERY.SUBMIT:
            for (const [key, value] of action.payload as FormData) {
                if (value != "") {
                    params.set(key, value as string);
                } else {
                    params.delete(key);
                }
            }
            params.set('page', '1');
            return params;
        default:
            return params;
    }
};

// a new search (SUBMIT/RESET) is worth a back-button entry; refining the current view (SORT/CHANGE_PAGE) is not
const PUSH_STATE_ACTIONS: ACTIONS_QUERY[] = [ACTIONS_QUERY.SUBMIT, ACTIONS_QUERY.RESET];

const useQueryAction = () => {
    const searchParams = useSearchParams();

    const dispatchQuery = (action: ActionType) => {
        const method = PUSH_STATE_ACTIONS.includes(action.type) ? 'pushState' : 'replaceState';
        window.history[method](null, '', `?${queryReducer(searchParams, action).toString()}`);
    };

    return { ACTIONS_QUERY, dispatchQuery };
};

export default useQueryAction;
