import { FC, useEffect } from "react";
import route, { useRouter } from "next/router";
import styles from "@styles/form.module.scss";
import { FormEvent, useState } from "react";

enum Input {
    Country = "Country",
    Greater = "Greater",
    Less = "Less",
}

export const Form: FC = () => {
    const router = useRouter();
    const [country, setCountry] = useState<string>("");
    const [greaterThan, setGreaterThan] = useState<number | "">("");
    const [lessThan, setLessThan] = useState<number | "">("");

    const input = (id: string, placeholder: string, value: string | number, onChange: (e: FormEvent<HTMLInputElement>) => void) => (
        <input type={id === Input.Country ? "text" : "number"} className="px-3 py-2 rounded-3 w-100 w-md-auto" id={id} placeholder={placeholder} value={value} onChange={onChange} />
    );
    const inputOnChange = (e: FormEvent<HTMLInputElement>, type: Input) => {
        const target = e.target as HTMLInputElement;
        if (type === Input.Country) {
            setCountry(target.value);
        } else if (type === Input.Greater) {
            setGreaterThan(parseInt(target.value));
        } else {
            setLessThan(parseInt(target.value));
        }
    };
    const searchResult = { ...(country && { country }), ...(greaterThan && { greaterThan }), ...(lessThan && { lessThan }) };

    useEffect(() => {
        setCountry((route.query.country as string) || "");
        setGreaterThan(Number(route.query.greaterThan) || "");
        setLessThan(Number(route.query.lessThan) || "");
    }, [router]);

    return (
        <>
            <div className="mb-3">
                <label htmlFor={Input.Country} className="form-label d-block mb-2">
                    Country Name
                </label>
                {input(Input.Country, "Country", country, (e: FormEvent<HTMLInputElement>) => {
                    inputOnChange(e, Input.Country);
                })}
            </div>
            <div className="mb-3">
                <label htmlFor={Input.Greater} className="form-label d-block me-3 mb-2">
                    GNP per Capital
                </label>
                <div className="d-flex">
                    {input(Input.Greater, "Greater than", greaterThan, (e: FormEvent<HTMLInputElement>) => {
                        inputOnChange(e, Input.Greater);
                    })}
                    <span className="mx-3">-</span>
                    {input(Input.Less, "Smaller than", lessThan, (e: FormEvent<HTMLInputElement>) => {
                        inputOnChange(e, Input.Less);
                    })}
                </div>
            </div>
            <div className="d-flex justify-content-between justify-content-md-start">
                <button className={`btn btn-primary ${styles.button}`} onClick={() => router.push({ pathname: router.pathname, query: { ...router.query, ...searchResult, page: 1 } }, undefined, { shallow: true })}>
                    Search
                </button>
                <div className="ms-3"></div>
                <button className={`btn btn-secondary ${styles.button}`} onClick={() => router.push(router.pathname, undefined, { shallow: true })}>
                    Reset
                </button>
            </div>
        </>
    );
};
