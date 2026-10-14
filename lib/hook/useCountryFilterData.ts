import { useMemo } from "react";
import { CountryType } from "@type/countryType";
import useQueryState from "@hook/useQueryState";
import * as R from "ramda";

const no_display = 10;
const useCountryFilterData = (data: readonly CountryType[]) => {
    const { country, greaterThan, lessThan, orderAsc, orderBy, page: currentPage } = useQueryState();

    const dataFiltered = useMemo(() => {
        const filter_By_Country = R.filter((o: CountryType) => country === null || R.toUpper(o.country.value).includes(R.toUpper(country)));
        const filter_By_GreaterThan = R.filter((o: CountryType) => greaterThan === null || o.value >= greaterThan);
        const filter_By_LessThan = R.filter((o: CountryType) => lessThan === null || o.value <= lessThan);
        const order = orderAsc ? R.ascend : R.descend;
        const sortByKey: (o: CountryType) => R.Ord = orderBy === "name" ? (o) => o.country.value : (o) => o.value;
        const filter = R.compose<(readonly CountryType[])[], readonly CountryType[], readonly CountryType[], readonly CountryType[], CountryType[]>(R.sort(order(sortByKey)), filter_By_Country, filter_By_GreaterThan, filter_By_LessThan);
        return filter(data);
    }, [data, country, greaterThan, lessThan, orderAsc, orderBy]); // no need to filter again when only page changes

    const showCurrentPage = R.slice((currentPage - 1) * no_display, currentPage * no_display);
    const dataDisplayed = showCurrentPage(dataFiltered);
    const totalPage = Math.ceil(dataFiltered.length / no_display);
    return { dataDisplayed, totalPage };
};
export default useCountryFilterData;
