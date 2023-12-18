import { useCallback, useEffect } from "react"
import { TextField } from "@mui/material"
import { debounce } from "@utils"

type Props = {
  search: string
  onChangeSearch: (value: string) => void
}

export const Filter = (props: Props) => {
  const { search, onChangeSearch } = props

  const debounceSearch = useCallback(
    debounce(function (value: string) {
      onChangeSearch(value)
    }),
    [debounce],
  )

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    debounceSearch(e.target.value)
  }

  useEffect(() => {
    return () => {
      debounceSearch.cancel()
    }
  }, [debounceSearch])

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
        onChange={onChange}
      />
    </>
  )
}
