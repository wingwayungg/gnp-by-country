import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FormType } from "@type/formType";
import styles from "./Form.module.scss";

const defaultValues: FormType = {
    country: "",
    greaterThan: "",
    lessThan: "",
};

export const FormComponent: FC = () => {
    const { register, reset, handleSubmit } = useForm<FormType>({
        defaultValues,
    });
    const router = useRouter();
    const { country, greaterThan, lessThan } = router.query;

    useEffect(() => {
        reset({
            country: (country as string) || "",
            greaterThan: Number(greaterThan) || "",
            lessThan: Number(lessThan) || "",
        });
    }, [router]);

    const onSubmit = (data: FormType) => {
        const dataToURL = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != ""));
        router.push({ pathname: router.pathname, query: { ...router.query, ...dataToURL, page: 1 } }, undefined, { shallow: true });
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="country" className="mb-3">
                <Form.Label>Country Name</Form.Label>
                <Form.Control type="text" className={inputClassName} placeholder="Country" {...register("country")} />
            </Form.Group>
            <Form.Group controlId="greater" className="mb-3">
                <Form.Label>GNP per Capital</Form.Label>
                <Stack className="justify-content-between justify-content-md-start" direction="horizontal" gap={3}>
                    <Form.Control type="number" className={inputClassName} placeholder="Greater than" {...register("greaterThan")} />
                    <span>-</span>
                    <Form.Control type="number" className={inputClassName} placeholder="Smaller than" {...register("lessThan")} />
                </Stack>
            </Form.Group>
            <Stack className="justify-content-between justify-content-md-start" direction="horizontal" gap={3}>
                {/* <button className={`btn btn-primary ${styles.button}`}/> */}
                <Button className={styles.button} variant="primary" type="submit">
                    Search
                </Button>
                {/* <button className={`btn btn-secondary ${styles.button}`}/> */}
                <Button className={styles.button} variant="secondary" onClick={() => router.push(router.pathname, undefined, { shallow: true })}>
                    Reset
                </Button>
            </Stack>
        </Form>
    );
};

const inputClassName = "px-3 py-2 rounded-3 w-100 w-md-auto";
