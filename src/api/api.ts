import { Pokemon, PokemonListItem } from "@types"
import axios from "axios"

const instance = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
})

interface PokemonsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<PokemonListItem>
}

export const getPokemons = async (
  offset: number,
  limit: number,
): Promise<PokemonsResponse> => {
  const res = await instance.get(`pokemon/?offset=${offset}&limit=${limit}`)
  return res.data
}

export const getPokemon = async (id: number): Promise<Pokemon> => {
  const res = await instance.get(`pokemon/${id}`)
  return res.data
}
