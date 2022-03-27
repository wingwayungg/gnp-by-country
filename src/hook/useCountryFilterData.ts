import { useState, useEffect, useMemo } from "react";
import {useRouter} from "next/router";
import { CountryType } from "@type/countryType";
import * as R from 'ramda'

const no_display = 10;
const useCountryFilterData = ()=>{
    const router = useRouter();
    const {country, greaterThan, lessThan, orderAsc, orderBy, page} = router.query
    const filterCountryFilterData = (data: CountryType[]) => {
        const filterData = useMemo(() => {
            const filter_By_Country = R.when(
                () => !R.isNil(country),
                R.filter((o: CountryType) => R.toUpper(o.country.value)?.includes(R.toUpper(country)))
            );
            const filter_By_GreaterThan = R.when(() => !R.isNil(greaterThan), R.filter(R.propSatisfies((x:number) => x >= Number(greaterThan), "value")));
            // const filter_By_GreaterThan = R.when(()=>!R.isNil(router.query.greaterThan),R.filter(R.where({["value"]: o=>o>= router.query.greaterThan})));
            const filter_By_LessThan = R.when(() => !R.isNil(lessThan), R.filter(R.propSatisfies((x:number) => x <= Number(lessThan), "value")));
            const order = R.ifElse(() => orderAsc === "true", R.ascend, R.descend);
            const sortByKey = R.path(orderBy === "name" ? ["country", "value"] : ["value"]);
            const sortBy = R.sort(order(sortByKey));
            const filter = R.compose(sortBy, filter_By_Country, filter_By_GreaterThan, filter_By_LessThan);
            return filter(data)
        }, [country, greaterThan, lessThan, orderAsc, orderBy]) // no need to filter again when only page changes
        return filterData as CountryType[];
    };
    
     const showCurrentPage =(data: CountryType[])=>{
        const currentPage = Number(page) || 1
        const showCurrentPage = R.slice((currentPage - 1) * no_display, currentPage * no_display);
        return showCurrentPage(data)
    } 
    return {filterCountryFilterData, showCurrentPage}
}
export default useCountryFilterData
