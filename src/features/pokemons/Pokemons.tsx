import { PokemonsList } from "@features/pokemons/PokemonsList"
import { Filter } from "@features/pokemons/Filter"
import { ErrorBanner } from "./ErrorBanner"
import { LIMIT, usePokemons } from "./usePokemons"

export const Pokemons = () => {
  const {
    type,
    page,
    types,
    onChangeSearch,
    onChangeType,
    onChangePage,
    pokemons,
    isLoading,
    count,
    searchError,
  } = usePokemons()

  return (
    <>
      <ErrorBanner />
      <Filter
        types={types}
        type={type}
        onChangeSearch={onChangeSearch}
        onChangeType={onChangeType}
      />
      <PokemonsList
        pokemons={pokemons}
        page={Number(page)}
        isLoading={isLoading}
        pages={Math.ceil(count / LIMIT)}
        searchError={searchError}
        onChangePage={onChangePage}
      />
    </>
  )
}
