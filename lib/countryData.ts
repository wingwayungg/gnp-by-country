import { CountryType } from "@type/countryType";

const WORLD_BANK_URL = "https://api.worldbank.org/v2/country/all/indicator/SL.GDP.PCAP.EM.KD?format=json&date=2020&per_page=266";

export const DATA_YEAR = "2020";

export async function fetchCountryGDP() {
    return fetch(WORLD_BANK_URL, { cache: "force-cache" })
        .then((res) => res.json())
        .then(
            (data) =>
                // the API repeats indicator id/name, iso3 code, date, decimal, obs_status and unit on every record and the app reads none of them, so only the fields kept here reach the RSC payload; 
                // to reduce file size transmitted over the network, entries without GNP data are dropped
                data?.[1]?.slice(49)?.flatMap((o: CountryType) => (o?.value ? [{ country: { id: o.country.id, value: o.country.value }, value: Math.trunc(o.value) }] : [])) as CountryType[]
        )
        .catch(() => [] as CountryType[]); // in case of error when fetching the API // clear cache
}
