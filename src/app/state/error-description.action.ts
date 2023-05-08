import { createAction, props } from "@ngrx/store";

export const setError = createAction(
    '[Error Description] Set Error',
    props<{ errorCode: string, errorMessage: string }>()
)

export const clearError = createAction('[Error Description] Clear Error')