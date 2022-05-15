import { FC, FormEvent, useEffect, useState } from "react";
import route, { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import styles from "@styles/form.module.scss";
import { InputEnum } from "@type/inputType";

export const Form: FC = () => {
    const router = useRouter();
    const [country, setCountry] = useState<string>("");
    const [greaterThan, setGreaterThan] = useState<number | "">("");
    const [lessThan, setLessThan] = useState<number | "">("");

    const inputOnChange = (e: FormEvent<HTMLInputElement>, type: InputEnum) => {
        const target = e.target as HTMLInputElement;
        if (type === InputEnum.Country) {
            setCountry(target.value);
        } else if (type === InputEnum.Greater) {
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
            {label(InputEnum.Country, "Country Name")}
            {input(InputEnum.Country, "Country", "text", country, (e: FormEvent<HTMLInputElement>) => {
                inputOnChange(e, InputEnum.Country);
            })}
            <VerticalSpace />
            {label(InputEnum.Greater, "GNP per Capital")}
            <Stack className="justify-content-between justify-content-md-start" direction="horizontal" gap={3}>
                {input(InputEnum.Greater, "Greater than", "number", greaterThan, (e: FormEvent<HTMLInputElement>) => {
                    inputOnChange(e, InputEnum.Greater);
                })}
                <span>-</span>
                {input(InputEnum.Less, "Smaller than", "number", lessThan, (e: FormEvent<HTMLInputElement>) => {
                    inputOnChange(e, InputEnum.Less);
                })}
            </Stack>
            <VerticalSpace />
            <Stack direction="horizontal" gap={3}>
                {/* <button className={`btn btn-primary ${styles.button}`}/> */}
                <Button className={styles.button} variant="primary" onClick={() => router.push({ pathname: router.pathname, query: { ...router.query, ...searchResult, page: 1 } }, undefined, { shallow: true })}>
                    Search
                </Button>
                {/* <button className={`btn btn-secondary ${styles.button}`}/> */}
                <Button className={styles.button} variant="secondary" onClick={() => router.push(router.pathname, undefined, { shallow: true })}>
                    Reset
                </Button>
            </Stack>
        </>
    );
};

const label = (htmlFor: string, text: string) => (
    <label htmlFor={htmlFor} className="form-label d-block mb-2">
        {text}
    </label>
);
const input = (id: string, placeholder: string, type: "text" | "number", value: string | number, onChange: (e: FormEvent<HTMLInputElement>) => void) => <input type={type} className="px-3 py-2 rounded-3 w-100 w-md-auto" id={id} placeholder={placeholder} value={value} onChange={onChange} />;

const VerticalSpace = () => <div className="mb-3" />;
