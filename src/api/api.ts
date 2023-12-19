import { Pokemon } from "@customTypes/Pokemon"
import { PokemonType } from "@customTypes/PokemonType"
import { ResultItem } from "@customTypes/ResultItem"
import axios from "axios"

const instance = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
})

interface ListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<ResultItem>
}

export const getPokemons = async (
  offset: number,
  limit: number,
): Promise<ListResponse> => {
  const res = await instance.get(`pokemon/?offset=${offset}&limit=${limit}`)
  return res.data
}

export const getPokemon = async (id: number): Promise<Pokemon> => {
  const res = await instance.get(`pokemon/${id}`)
  return res.data
}

export const getPokemonByName = async (name: string): Promise<Pokemon> => {
  const res = await instance.get(`pokemon/${name}`)
  return res.data
}

export const getPokemonsType = async (id: number): Promise<PokemonType> => {
  const res = await instance.get(`type/${id}`)
  return res.data
}

export const getTypes = async (): Promise<ListResponse> => {
  const res = await instance.get(`type`)
  return res.data
}
