import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { OrderBy } from "@type/sortType";

// Each action carries exactly the payload its case reads, so the reducer narrows on `type` instead of casting.
type QueryAction =
    | { readonly type: "change-page"; readonly payload: { readonly page: number } }
    | { readonly type: "reset" }
    | { readonly type: "sort"; readonly payload: { readonly orderBy?: OrderBy; readonly orderAsc?: boolean } }
    | { readonly type: "submit"; readonly payload: FormData };

const queryReducer = (searchParams: ReadonlyURLSearchParams, action: QueryAction): URLSearchParams => {
    const params = new URLSearchParams(searchParams.toString());
    switch (action.type) {
        case "change-page":
            params.set("page", action.payload.page.toString());
            return params;
        case "reset":
            params.delete("country");
            params.delete("greaterThan");
            params.delete("lessThan");
            return params;
        case "sort": {
            const { orderAsc, orderBy } = action.payload;
            if (orderBy) params.set("orderBy", orderBy);
            if (orderAsc !== undefined) params.set("orderAsc", orderAsc.toString());
            params.set("page", "1");
            return params;
        }
        case "submit":
            for (const [key, value] of action.payload) {
                if (typeof value === "string" && value !== "") {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }
            }
            params.set("page", "1");
            return params;
    }
};

// a new search (submit/reset) is worth a back-button entry; refining the current view (sort/change-page) is not
const PUSH_STATE_ACTIONS: readonly QueryAction["type"][] = ["submit", "reset"];

const useQueryAction = () => {
    const searchParams = useSearchParams();

    const dispatchQuery = (action: QueryAction) => {
        const method = PUSH_STATE_ACTIONS.includes(action.type) ? "pushState" : "replaceState";
        window.history[method](null, "", `?${queryReducer(searchParams, action).toString()}`);
    };

    return { dispatchQuery };
};

export default useQueryAction;
