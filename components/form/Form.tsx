import Form from "next/form";
import { useSearchParams } from "next/navigation";
import React from "react";
import Button from "react-bootstrap/Button";
import BootstrapForm from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import useQueryAction from "@hook/useQueryAction";
import styles from "./Form.module.scss";

export const FormComponent = () => {
    const searchParams = useSearchParams();
    const { ACTIONS_QUERY, dispatchQuery } = useQueryAction();
    return (
        <Form action={(data: FormData) => dispatchQuery({ type: ACTIONS_QUERY.SUBMIT, payload: data })}>
            <BootstrapForm.Group controlId="country" className="mb-3">
                <BootstrapForm.Label>Country Name</BootstrapForm.Label>
                <BootstrapForm.Control name="country" type="text" className={inputClassName} placeholder="Country" defaultValue={searchParams.get("country") ?? ""} />
            </BootstrapForm.Group>
            <BootstrapForm.Group controlId="greater" className="mb-3">
                <BootstrapForm.Label>GNP per Capital</BootstrapForm.Label>
                <Stack className="justify-content-between justify-content-md-start" direction="horizontal" gap={3}>
                    <BootstrapForm.Control name="greaterThan" type="number" className={inputClassName} placeholder="Greater than" defaultValue={Number(searchParams.get("greaterThan")) || ""} />
                    <span>-</span>
                    <BootstrapForm.Control name="lessThan" type="number" className={inputClassName} placeholder="Smaller than" defaultValue={Number(searchParams.get("lessThan")) || ""} />
                </Stack>
            </BootstrapForm.Group>
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
