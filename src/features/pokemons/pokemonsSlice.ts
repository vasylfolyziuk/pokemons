import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState, AppThunk } from "@store"
import queryString from "query-string"
import axios from "axios"
import { getPokemon, getPokemons } from "@api/api"
import { Pokemon, PokemonListItem } from "@types"

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
}

export const fetchPokemons = createAsyncThunk(
  "pokemons/fetchAll",
  async (params: FetchPokemonsParams) => {
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
  },
)

export const pokemonsSlice = createSlice({
  name: "pokemons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemons.pending, (state) => {
        state.loading = true
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
      .addCase(fetchPokemons.rejected, (state) => {
        state.loading = false
      })
  },
})

export const selectPokemons = (state: RootState) => state.pokemons.list
export const selectFilter = (state: RootState) => state.pokemons.filter
export const selectLoading = (state: RootState) => state.pokemons.loading

export default pokemonsSlice.reducer
