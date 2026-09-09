// The result of the askQuestion server action, held as useActionState's state in PromptInput.
export type AskState =
    | { readonly status: "idle" }
    | { readonly status: "answered"; readonly question: string; readonly answer: string }
    | { readonly status: "error"; readonly question: string; readonly error: string };
