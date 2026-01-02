import Form from "next/form";
import { useSearchParams } from "next/navigation";
import React from "react";
import Button from "react-bootstrap/Button";
import BootstrapForm from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import useQueryAction from "@hook/useQueryAction";

const inputClassName = "w-100 w-md-auto";

export const FormComponent = () => {
    const searchParams = useSearchParams();
    const { ACTIONS_QUERY, dispatchQuery } = useQueryAction();
    return (
        <div className="card-premium p-4 h-100 bg-body">
            <h4 className="mb-4 fw-bold text-secondary">Filter Data</h4>
            <Form action={(data: FormData) => dispatchQuery({ type: ACTIONS_QUERY.SUBMIT, payload: data })}>
                <BootstrapForm.Group controlId="country" className="mb-4 vstack">
                    <BootstrapForm.Label className="small text-uppercase fw-bold text-muted">Country Name</BootstrapForm.Label>
                    <BootstrapForm.Control name="country" type="text" className="form-control-lg bg-body-secondary border-0" placeholder="e.g. United States" defaultValue={searchParams.get("country") ?? ""} />
                </BootstrapForm.Group>

                <BootstrapForm.Group controlId="greater" className="mb-4">
                    <BootstrapForm.Label className="small text-uppercase fw-bold text-muted">GNP Range</BootstrapForm.Label>
                    <Stack className="align-items-center" direction="horizontal" gap={2}>
                        <BootstrapForm.Control name="greaterThan" type="number" className={`form-control-lg bg-body-secondary border-0 ${inputClassName}`} placeholder="Min" defaultValue={Number(searchParams.get("greaterThan")) || ""} />
                        <span className="text-muted fw-bold">to</span>
                        <BootstrapForm.Control name="lessThan" type="number" className={`form-control-lg bg-body-secondary border-0 ${inputClassName}`} placeholder="Max" defaultValue={Number(searchParams.get("lessThan")) || ""} />
                    </Stack>
                </BootstrapForm.Group>

                <Stack direction="horizontal" gap={3} className="mt-5">
                    <Button className="flex-grow-1 py-2 fw-bold" variant="primary" type="submit" style={{ background: "var(--primary-gradient)", border: "none" }}>
                        Search
                    </Button>
                    <Button className="flex-grow-1 py-2 fw-bold" variant="outline-secondary" onClick={() => dispatchQuery({ type: ACTIONS_QUERY.RESET })}>
                        Reset
                    </Button>
                </Stack>
            </Form>
        </div>
    );
};
