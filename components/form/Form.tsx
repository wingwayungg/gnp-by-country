import Form from "next/form";
import Button from "react-bootstrap/Button";
import BootstrapForm from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import useQueryAction from "@hook/useQueryAction";
import useQueryState from "@hook/useQueryState";

const inputClassName = "w-100 w-md-auto";

export const FormComponent = () => {
    const { country, greaterThan, lessThan } = useQueryState();
    const { dispatchQuery } = useQueryAction();
    return (
        <div className="card-premium p-4 h-100 bg-body">
            <h2 className="mb-4 fw-bold text-secondary fs-5">Filter Data</h2>
            <Form action={(data: FormData) => dispatchQuery({ type: "submit", payload: data })}>
                <BootstrapForm.Group controlId="country" className="mb-4 vstack">
                    <BootstrapForm.Label className="small text-uppercase fw-bold text-muted">Country Name</BootstrapForm.Label>
                    <BootstrapForm.Control name="country" type="text" className="form-control-lg bg-body-secondary border-0" placeholder="e.g. United States" defaultValue={country ?? ""} />
                </BootstrapForm.Group>

                <BootstrapForm.Group controlId="greater" className="mb-4">
                    <BootstrapForm.Label className="small text-uppercase fw-bold text-muted">GNP Range</BootstrapForm.Label>
                    <Stack className="align-items-center" direction="horizontal" gap={2}>
                        <BootstrapForm.Control name="greaterThan" type="number" className={`form-control-lg bg-body-secondary border-0 ${inputClassName}`} placeholder="Min" defaultValue={greaterThan || ""} />
                        <span className="text-muted fw-bold">to</span>
                        <BootstrapForm.Control name="lessThan" type="number" className={`form-control-lg bg-body-secondary border-0 ${inputClassName}`} placeholder="Max" defaultValue={lessThan || ""} />
                    </Stack>
                </BootstrapForm.Group>

                <Stack direction="horizontal" gap={3}>
                    <Button className="flex-grow-1 py-2 fw-bold" variant="primary" type="submit" style={{ background: "var(--primary-gradient)", border: "none" }}>
                        Search
                    </Button>
                    <Button className="flex-grow-1 py-2 fw-bold" variant="outline-secondary" onClick={() => dispatchQuery({ type: "reset" })}>
                        Reset
                    </Button>
                </Stack>
            </Form>
        </div>
    );
};
