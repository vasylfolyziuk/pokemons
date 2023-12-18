import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "@hooks/hooks"
import {
  fetchPokemons,
  selectPokemons,
  selectFilter,
  selectLoading,
  fetchPokemonsByName,
  selectSearchError,
  selectSortedPokemons,
} from "@features/pokemons/pokemonsSlice"
import { PokemonsList } from "@features/pokemons/PokemonsList"
import { Filter } from "@features/pokemons/Filter"
import { ErrorBanner } from "./ErrorBanner"

const OFFSET = 0
const LIMIT = 12
const PAGE = 1

export const Pokemons = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: `${PAGE}`,
    search: "",
  })
  const dispatch = useAppDispatch()
  const pokemons = useAppSelector(selectSortedPokemons)
  const filter = useAppSelector(selectFilter)
  const isLoading = useAppSelector(selectLoading)
  const searchError = useAppSelector(selectSearchError)

  useEffect(() => {
    const pageQueryParam = Number(searchParams.get("page"))
    const searchQueryParam = searchParams.get("search")

    if (searchQueryParam?.trim()) {
      dispatch(fetchPokemonsByName(searchQueryParam))
    } else {
      let page = pageQueryParam > 0 ? pageQueryParam : PAGE
      let offset = OFFSET

      if (page > PAGE) {
        offset = (page - 1) * LIMIT
      }

      dispatch(fetchPokemons({ offset, limit: LIMIT }))
    }
  }, [dispatch, searchParams])

  const onChangeSearch = (value: string) => {
    const search = value.trim()
    setSearchParams(search.length ? { search: value } : undefined)
  }

  const onChangePage = (e: React.ChangeEvent<unknown>, page: number) => {
    setSearchParams({ page: `${page}` })
  }

  return (
    <>
      <ErrorBanner />
      <Filter search={filter.search} onChangeSearch={onChangeSearch} />
      <PokemonsList
        pokemons={pokemons}
        page={Number(searchParams.get("page"))}
        isLoading={isLoading}
        pages={Math.ceil(filter.count / LIMIT)}
        searchError={searchError}
        onChangePage={onChangePage}
      />
    </>
  )
}
