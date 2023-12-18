import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import queryString from "query-string"
import { useAppSelector, useAppDispatch } from "@hooks/hooks"
import {
  fetchPokemons,
  selectPokemons,
  selectFilter,
  selectLoading,
} from "@features/pokemons/pokemonsSlice"
import { Pagination } from "@mui/material"
import { PokemonsList } from "./PokemonsList"

export type QueryParamsType = {
  page?: string
}

const OFFSET = 0
const LIMIT = 12
const PAGE = 1

export const Pokemons = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const pokemons = useAppSelector(selectPokemons)
  const filter = useAppSelector(selectFilter)
  const isLoading = useAppSelector(selectLoading)

  const [page, setPage] = useState<number>(0)

  useEffect(() => {
    const parsed: QueryParamsType = queryString.parse(location.search)
    let page = Number(parsed.page) > 0 ? Number(parsed.page) : PAGE
    let offset = OFFSET

    if (page > PAGE) {
      offset = (page - 1) * LIMIT
    }

    setPage(page)
    dispatch(fetchPokemons({ offset, limit: LIMIT }))
  }, [dispatch, location])

  const onChangePage = (e: React.ChangeEvent<unknown>, page: number) => {
    navigate(`?page=${page}`)
  }

  return (
    <>
      <PokemonsList
        pokemons={pokemons}
        page={page}
        isLoading={isLoading}
        count={filter.count}
        limit={LIMIT}
        onChangePage={onChangePage}
      />
    </>
  )
}
