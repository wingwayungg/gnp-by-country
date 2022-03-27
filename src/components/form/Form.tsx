import { FC, useEffect } from "react";
import route, { useRouter } from "next/router";
import styles from "@styles/form.module.scss";
import { FormEvent, useState } from "react";
const GREATER = "GREATER";
const LESS = "LESS";
export const Form:FC = () => {
    const router = useRouter();
    const [country, setCountry] = useState<string>("");
    const [greaterThan, setGreaterThan] = useState<number | null | "">("");
    const [lessThan, setLessThan] = useState<number | null | "">("");

    const gnpInputOnChange = (e: FormEvent<HTMLInputElement>, type: typeof GREATER | typeof LESS) => {
        const target = e.target as HTMLInputElement;
        if (type === GREATER) {
            setGreaterThan(parseInt(target.value));
        } else {
            setLessThan(parseInt(target.value));
        }
    };
    useEffect(() => {
        setCountry((route.query.country as string) || "");
        setGreaterThan(Number(route.query.greaterThan));
        setLessThan(Number(route.query.lessThan));
    }, [router]);
    const result = { ...(country && { country }), ...(greaterThan && { greaterThan }), ...(lessThan && { lessThan }) };
    const input = (id: string, placeholder: string, value: string | number, onChange: (e: FormEvent<HTMLInputElement>) => void) => <input type={id === "country" ? "text" : "number"} className="px-3 py-2 rounded-3 w-100 w-md-auto" id={id} placeholder={placeholder} value={value} onChange={onChange} />;
    return (
        <>
            <div className="mb-3">
                <label htmlFor="country" className="form-label d-block mb-2">
                    Country Name
                </label>
                {input("country", "Country", country, (e: FormEvent<HTMLInputElement>) => {
                    const target = e.target as HTMLInputElement;
                    setCountry(target.value);
                })}
            </div>
            <div className="mb-3">
                <label htmlFor="greaterThan" className="form-label d-block me-3 mb-2">
                    GNP per Capital
                </label>
                <div className="d-flex">
                    {input("greaterThan", "Greater than", greaterThan, (e: FormEvent<HTMLInputElement>) => {
                        gnpInputOnChange(e, GREATER);
                    })}
                    <span className="mx-3">-</span>
                    {input("lessThan", "Smaller than", lessThan, (e: FormEvent<HTMLInputElement>) => {
                        gnpInputOnChange(e, LESS);
                    })}
                </div>
            </div>
            <div className="d-flex justify-content-between justify-content-md-start">
                <button className={`btn btn-primary ${styles.button}`} onClick={() => router.push({ pathname: router.pathname, query: { ...router.query, ...result, page: 1 } }, undefined, { shallow: true })}>
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
