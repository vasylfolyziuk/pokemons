import { Pagination } from "@mui/material"
import { Pokemon } from "@types"
import { PokemonsListItem } from "./PokemonListItem"

type Props = {
  pokemons: Array<Pokemon>
  page: number
  isLoading: boolean
  count: number
  limit: number
  onChangePage: (e: React.ChangeEvent<unknown>, page: number) => void
}

export const PokemonsList = (props: Props) => {
  const { pokemons, page, isLoading, count, limit, onChangePage } = props

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {pokemons.map((pokemon) => (
            <PokemonsListItem
              key={pokemon.name}
              name={pokemon.name}
              type={pokemon.types[0].type.name}
            />
          ))}
          <Pagination
            page={page}
            disabled={isLoading}
            count={Math.ceil(count / limit)}
            onChange={onChangePage}
          />
        </>
      )}
    </>
  )
}
