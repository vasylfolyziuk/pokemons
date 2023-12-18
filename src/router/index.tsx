import { createBrowserRouter } from "react-router-dom"

import App from "@/App"
import { Pokemons } from "@features/pokemons/Pokemons"
import { PokemonDetails } from "@features/pokemonDetails/PokemonDetails"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Pokemons />,
      },
      {
        path: "pokemon/:id",
        element: <PokemonDetails />,
      },
    ],
  },
])
