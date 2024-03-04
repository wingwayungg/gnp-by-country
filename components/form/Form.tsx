import { useSearchParams } from "next/navigation";
import React, { FC } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import useQueryAction from "@hook/useQueryAction";
import { FormType } from "@type/formType";
import styles from "./Form.module.scss";

export const FormComponent: FC = () => {
    const searchParams = useSearchParams();
    const { register, handleSubmit } = useForm<FormType>({
        defaultValues: {
            country: searchParams.get("country") ?? "",
            greaterThan: Number(searchParams.get("greaterThan")) || "",
            lessThan: Number(searchParams.get("lessThan")) || "",
        },
    });

    const { ACTIONS_QUERY, dispatchQuery } = useQueryAction();

    return (
        <Form onSubmit={handleSubmit((data: FormType) => dispatchQuery({ type: ACTIONS_QUERY.SUBMIT, payload: data }))}>
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
                <Button className={styles.button} variant="secondary" onClick={() => dispatchQuery({ type: ACTIONS_QUERY.RESET })}>
                    Reset
                </Button>
            </Stack>
        </Form>
    );
};

const inputClassName = "px-3 py-2 rounded-3 w-100 w-md-auto";
