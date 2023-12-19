import { useEffect, useRef } from "react"
import { MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material"
import { debounce, parseUrlId } from "@utils"
import { ResultItem } from "@customTypes/ResultItem"
import { EMPTY_OPTION } from "./usePokemons"

type Props = {
  types: Array<ResultItem>
  type: string | undefined
  onChangeSearch: (value: string) => void
  onChangeType: (value: string) => void
}

export const Filter = (props: Props) => {
  const { types, type, onChangeSearch, onChangeType } = props
  const searchInput = useRef(null)

  // const debounceSearch = useCallback(
  //   debounce(function (value: string) {
  //     onChangeSearch(value)
  //   }),
  //   [onChangeSearch, debounce],
  // )

  const debounceSearch = debounce(function (value: string) {
    onChangeSearch(value)
  })

  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    debounceSearch(e.target.value)
  }

  const handleType = (e: SelectChangeEvent<string>) => {
    onChangeType(e.target.value)
  }

  useEffect(() => {
    return () => {
      debounceSearch.cancel()
    }
  }, [debounceSearch])

  return (
    <div className="filter">
      <TextField
        ref={searchInput}
        value={type ? "" : undefined}
        className="search-input"
        label="Search Pokemon"
        variant="outlined"
        onChange={handleSearch}
      />

      {types.length > 0 && (
        <Select value={type || EMPTY_OPTION} onChange={handleType}>
          <MenuItem key="default" value={EMPTY_OPTION}>
            Select type
          </MenuItem>
          {types.map((type) => (
            <MenuItem key={type.name} value={parseUrlId(type.url)}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
      )}
    </div>
  )
}
