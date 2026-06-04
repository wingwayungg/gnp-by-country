import { useMemo } from "react";
import { CountryType } from "@type/countryType";
import useQueryState from "@hook/useQueryState";
import * as R from "ramda";

const no_display = 10;
const useCountryFilterData = (data: readonly CountryType[]) => {
    const { country, greaterThan, lessThan, orderAsc, orderBy, page: currentPage } = useQueryState();

    const dataFiltered = useMemo(() => {
        const filter_By_Country = R.when<readonly CountryType[], readonly CountryType[]>(
            () => !R.isNil(country),
            R.filter((o: CountryType) => R.toUpper(o.country.value)?.includes(R.toUpper(country as string)))
        );
        const filter_By_GreaterThan = R.when<readonly CountryType[], readonly CountryType[]>(() => !R.isNil(greaterThan), R.filter(R.propSatisfies((x: number) => x >= Number(greaterThan), "value")));
        const filter_By_LessThan = R.when<readonly CountryType[], readonly CountryType[]>(() => !R.isNil(lessThan), R.filter(R.propSatisfies((x: number) => x <= Number(lessThan), "value")));
        const order = orderAsc ? R.ascend : R.descend;
        // @ts-expect-error - R.path's return type can't be narrowed to R.Ord from a dynamic key path
        const sortByKey: (obj: CountryType) => R.Ord = R.path(orderBy === "name" ? ["country", "value"] : ["value"]);
        const sortBy = R.sort(order(sortByKey));
        const filter = R.compose<(readonly CountryType[])[], readonly CountryType[], readonly CountryType[], readonly CountryType[], CountryType[]>(sortBy, filter_By_Country, filter_By_GreaterThan, filter_By_LessThan);
        return filter(data);
    }, [data, country, greaterThan, lessThan, orderAsc, orderBy]); // no need to filter again when only page changes

    const showCurrentPage = R.slice((currentPage - 1) * no_display, currentPage * no_display);
    const dataDisplayed = showCurrentPage(dataFiltered);
    const totalPage = Math.ceil(dataFiltered?.length / no_display);
    return { dataDisplayed, totalPage };
};
export default useCountryFilterData;
