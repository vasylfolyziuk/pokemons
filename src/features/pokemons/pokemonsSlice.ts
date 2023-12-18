import {
  createAction,
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit"
import { RootState, AppThunk } from "@store"
import queryString from "query-string"
import axios, { AxiosError } from "axios"
import { getPokemon, getPokemons, getPokemonsByName } from "@api/api"
import { Pokemon, PokemonListItem } from "@types"

const ERROR = "Something went wrong. Please reload page"

export type FetchPokemonsParams = {
  offset: number
  limit: number
}

export interface PokemonsState {
  list: Array<Pokemon>
  filter: {
    count: number
    offset: number | null
    search: string
    type: string
  }
  loading: boolean
  searchError: string | null
  error: string | null
}

const initialState: PokemonsState = {
  list: [],
  filter: {
    count: 0,
    offset: null,
    search: "",
    type: "",
  },
  loading: false,
  searchError: null,
  error: null,
}

export const fetchPokemons = createAsyncThunk(
  "pokemons/fetchAll",
  async (params: FetchPokemonsParams) => {
    try {
      const pokemonsListResult = await getPokemons(params.offset, params.limit)

      const pokemons: Array<Pokemon> = await Promise.all(
        pokemonsListResult.results.map((pokemon) => {
          const id = pokemon.url
            .split("/")
            .filter((path) => path)
            .pop()
          return getPokemon(Number(id))
        }),
      )

      return {
        count: pokemonsListResult.count,
        next: pokemonsListResult.next,
        previous: pokemonsListResult.previous,
        pokemons,
      }
    } catch (error: unknown) {
      throw new Error(ERROR)
    }
  },
)

export const fetchPokemonsByName = createAsyncThunk(
  "pokemons/fetchPokemonsByName",
  async (name: string) => {
    try {
      return await getPokemonsByName(name)
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new AxiosError(`Pokemon "${name}" does not exists.`)
        }
      }

      throw new Error(ERROR)
    }
  },
)

export const pokemonsSlice = createSlice({
  name: "pokemons",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemons.pending, (state) => {
        state.loading = true
        state.error = ""
        state.searchError = ""
      })
      .addCase(fetchPokemons.fulfilled, (state, action) => {
        const { count, next, pokemons } = action.payload
        const offset = queryString.parseUrl(next || "")
        state.loading = false
        state.list = pokemons
        state.filter = {
          count,
          offset: Number(offset.query.offset),
          search: state.filter.search,
          type: state.filter.type,
        }
      })
      .addCase(fetchPokemons.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || ERROR
      })

      .addCase(fetchPokemonsByName.pending, (state) => {
        state.loading = true
        state.error = ""
        state.searchError = ""
        state.list = []
        state.filter = { ...initialState.filter }
      })
      .addCase(fetchPokemonsByName.fulfilled, (state, action) => {
        state.loading = false
        state.list = [action.payload]
      })
      .addCase(fetchPokemonsByName.rejected, (state, action) => {
        state.loading = false
        state.searchError = action.error.message || ERROR
      })
  },
})

export const clearError = pokemonsSlice.actions.clearError

export const selectPokemons = (state: RootState) => state.pokemons.list
export const selectFilter = (state: RootState) => state.pokemons.filter
export const selectLoading = (state: RootState) => state.pokemons.loading
export const selectError = (state: RootState) => state.pokemons.error
export const selectSearchError = (state: RootState) =>
  state.pokemons.searchError

export const selectSortedPokemons = createSelector(
  [selectPokemons],
  (pokemons) => {
    return [...pokemons].sort((pokemonA, pokemonB) => {
      const pokemonATypes = pokemonA.types
      const pokemonBTypes = pokemonB.types
      let af = pokemonATypes[0].type.name || ""
      let bf = pokemonBTypes[0].type.name || ""
      let as = pokemonATypes[1]?.type?.name || ""
      let bs = pokemonBTypes[1]?.type?.name || ""

      if (af === bf) {
        return as < bs ? -1 : 1
      } else {
        return af < bf ? -1 : 1
      }
    })
  },
)

export default pokemonsSlice.reducer
