import { useAppDispatch, useAppSelector } from "@hooks/hooks"
import { clearError, selectError } from "./pokemonsSlice"
import { Alert, Snackbar } from "@mui/material"
import { useCallback } from "react"

export const ErrorBanner = () => {
  const dispatch = useAppDispatch()
  const error = useAppSelector(selectError)

  const handleClose = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return (
    error && (
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={!!error}
        onClose={handleClose}
      >
        <Alert severity="error" onClose={handleClose}>
          {error}
        </Alert>
      </Snackbar>
    )
  )
}
