import { createReducer, on } from "@ngrx/store"
import { clearError, setError } from "./error-description.action"

export interface ErrorDescription {
    error: boolean,
    errorCode?: string,
    errorMessage?: string
}

export const init: ErrorDescription = { error: false }

export const errorDescriptionReducer = createReducer(
    init,
    on(setError, (state, { errorCode, errorMessage }) => ({ error: true, errorCode, errorMessage })),
    on(clearError, (state) => ({ error: false }))
)