import { useMemo } from "react";
import { useRouter } from "next/router";
import { CountryType } from "@type/countryType";
import * as R from "ramda";

const no_display = 10;
const useCountryFilterData = (data: CountryType[]) => {
    const router = useRouter();
    const { country, greaterThan, lessThan, orderAsc, orderBy, page } = router.query;

    const dataFiltered = useMemo(() => {
        const filter_By_Country = R.when(
            () => !R.isNil(country),
            R.filter((o: CountryType) => R.toUpper(o.country.value)?.includes(R.toUpper(country as string)))
        );
        const filter_By_GreaterThan = R.when<CountryType[], CountryType[]>(() => !R.isNil(greaterThan), R.filter(R.propSatisfies((x: number) => x >= Number(greaterThan), "value")));
        const filter_By_LessThan = R.when<CountryType[], CountryType[]>(() => !R.isNil(lessThan), R.filter(R.propSatisfies((x: number) => x <= Number(lessThan), "value")));
        const order = orderAsc === "true" ? R.ascend : R.descend;
        const sortByKey: (obj: any) => R.Ord = R.path(orderBy === "name" ? ["country", "value"] : ["value"]);
        const sortBy = R.sort(order(sortByKey));
        const filter = R.compose<CountryType[][], CountryType[], CountryType[], CountryType[], CountryType[]>(sortBy, filter_By_Country, filter_By_GreaterThan, filter_By_LessThan);
        return filter(data);
    }, [country, greaterThan, lessThan, orderAsc, orderBy]); // no need to filter again when only page changes

    const currentPage = Number(page) || 1;
    const showCurrentPage = R.slice((currentPage - 1) * no_display, currentPage * no_display);
    const dataDisplayed = showCurrentPage(dataFiltered);
    const totalPage = Math.ceil(dataFiltered?.length / no_display);
    return { dataDisplayed, totalPage };
};
export default useCountryFilterData;
