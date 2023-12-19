import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "@store"
import { AxiosError } from "axios"
import {
  getPokemon,
  getPokemons,
  getPokemonByName,
  getPokemonsType,
  getTypes,
} from "@api/api"
import { Pokemon } from "@customTypes/Pokemon"
import { ResultItem } from "@customTypes/ResultItem"
import { parseUrlId } from "@utils"

export const ERROR = "Something went wrong. Please reload page"

export type FetchPokemonsParams = {
  offset: number
  limit: number
}

export interface PokemonsState {
  list: Array<Pokemon>
  types: Array<ResultItem>
  count: number
  loading: boolean
  searchError: string | null
  error: string | null
}

const initialState: PokemonsState = {
  list: [],
  types: [],
  count: 0,
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
          const id = parseUrlId(pokemon.url)
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

export const fetchPokemonByName = createAsyncThunk(
  "pokemons/fetchPokemonByName",
  async (name: string) => {
    try {
      return await getPokemonByName(name)
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new AxiosError(`Pokemon "${name}" does not exists.`)
      }

      throw new Error(ERROR)
    }
  },
)

export const fetchPokemonsByType = createAsyncThunk(
  "pokemons/fetchPokemonsByType",
  async (url: string) => {
    try {
      const id = parseUrlId(url)
      const response = await getPokemonsType(Number(id))

      const pokemons: Array<Pokemon> = await Promise.all(
        response.pokemon.map((pokemonSlot) => {
          const id = parseUrlId(pokemonSlot.pokemon.url)
          return getPokemon(Number(id))
        }),
      )

      return {
        pokemons,
      }
    } catch (error: unknown) {
      throw new Error(ERROR)
    }
  },
)

export const fetchTypes = createAsyncThunk("pokemons/fetchTypes", async () => {
  try {
    return await getTypes()
  } catch (error: unknown) {
    throw new Error(ERROR)
  }
})

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
        Object.assign(state, initialState, {
          loading: true,
          types: state.types,
        })
      })
      .addCase(fetchPokemons.fulfilled, (state, action) => {
        const { count, pokemons } = action.payload
        state.loading = false
        state.list = pokemons
        state.count = count
      })
      .addCase(fetchPokemons.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || ERROR
      })

      .addCase(fetchPokemonByName.pending, (state) => {
        Object.assign(state, initialState, {
          loading: true,
          types: state.types,
        })
      })
      .addCase(fetchPokemonByName.fulfilled, (state, action) => {
        state.loading = false
        state.list = [action.payload]
      })
      .addCase(fetchPokemonByName.rejected, (state, action) => {
        state.loading = false
        state.searchError = action.error.message || ERROR
      })

      .addCase(fetchTypes.fulfilled, (state, action) => {
        state.types = action.payload.results
      })
      .addCase(fetchTypes.rejected, (state, action) => {
        state.error = action.error.message || ERROR
      })

      .addCase(fetchPokemonsByType.pending, (state) => {
        Object.assign(state, initialState, {
          loading: true,
          types: state.types,
        })
      })
      .addCase(fetchPokemonsByType.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload.pokemons
      })
      .addCase(fetchPokemonsByType.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || ERROR
      })
  },
})

export const clearError = pokemonsSlice.actions.clearError

export const selectPokemons = (state: RootState) => state.pokemons.list
export const selectTypes = (state: RootState) => state.pokemons.types
export const selectCount = (state: RootState) => state.pokemons.count
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
