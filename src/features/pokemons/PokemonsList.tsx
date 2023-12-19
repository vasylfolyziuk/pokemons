import { Pagination } from "@mui/material"
import { Pokemon } from "@customTypes/Pokemon"
import { PokemonsListItem } from "./PokemonListItem"

type Props = {
  pokemons: Array<Pokemon>
  page: number
  isLoading: boolean
  pages: number
  searchError: string | null
  onChangePage: (e: React.ChangeEvent<unknown>, page: number) => void
}

export const PokemonsList = (props: Props) => {
  const { pokemons, page, isLoading, pages, searchError, onChangePage } = props

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {pokemons.map((pokemon) => (
            <PokemonsListItem
              key={pokemon.id}
              id={pokemon.id}
              name={pokemon.name}
              type={pokemon.types.map((item) => item.type.name).join(", ")}
            />
          ))}
          {pages > 0 ? (
            <Pagination
              className="pagination"
              page={page}
              disabled={isLoading}
              count={pages}
              onChange={onChangePage}
            />
          ) : (
            <div>
              {searchError && pokemons.length === 0 && searchError}
              {!searchError && pokemons.length === 0 && "No pokemons"}
            </div>
          )}
        </>
      )}
    </>
  )
}
