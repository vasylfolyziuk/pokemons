import { useAppDispatch, useAppSelector } from "@hooks/hooks"
import { useSearchParams } from "react-router-dom"
import {
  fetchPokemonByName,
  fetchPokemons,
  fetchPokemonsByType,
  fetchTypes,
  selectCount,
  selectLoading,
  selectSearchError,
  selectSortedPokemons,
  selectTypes,
} from "./pokemonsSlice"
import { useEffect } from "react"
import { parseUrlId } from "@utils"

const OFFSET = 0
const PAGE = 1
export const LIMIT = 12
export const EMPTY_OPTION = "EMPTY_OPTION"

export const usePokemons = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: `${PAGE}`,
    search: "",
    type: "",
  })

  const dispatch = useAppDispatch()
  const pokemons = useAppSelector(selectSortedPokemons)
  const types = useAppSelector(selectTypes)
  const count = useAppSelector(selectCount)
  const isLoading = useAppSelector(selectLoading)
  const searchError = useAppSelector(selectSearchError)
  const typeParam = searchParams.get("type")?.trim()

  useEffect(() => {
    const pageParam = Number(searchParams.get("page"))
    const searchParam = searchParams.get("search")?.trim()

    if (types.length === 0) {
      dispatch(fetchTypes())
    }

    if (searchParam) {
      dispatch(fetchPokemonByName(searchParam))
    } else if (typeParam) {
      dispatch(fetchPokemonsByType(typeParam))
    } else {
      let page = pageParam > 0 ? pageParam : PAGE
      let offset = OFFSET

      if (page > PAGE) {
        offset = (page - 1) * LIMIT
      }

      dispatch(fetchPokemons({ offset, limit: LIMIT }))
    }
  }, [dispatch, searchParams, typeParam, types])

  const onChangeSearch = (value: string) => {
    const search = value.trim()
    setSearchParams(search.length > 0 ? { search: value } : { page: `${PAGE}` })
  }

  const onChangeType = (type: string) => {
    const isTypeSelected = type.length > 0 && type !== EMPTY_OPTION
    setSearchParams(
      isTypeSelected ? { type: parseUrlId(type)! } : { page: `${PAGE}` },
    )
  }

  const onChangePage = (e: React.ChangeEvent<unknown>, page: number) => {
    setSearchParams({ page: `${page}` })
  }

  return {
    type: typeParam,
    page: searchParams.get("page"),
    types,
    onChangeSearch,
    onChangeType,
    onChangePage,
    pokemons,
    isLoading,
    count,
    searchError,
  }
}
