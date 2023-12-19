import { getPokemon } from "@api/api"
import { Pokemon } from "@customTypes/Pokemon"
import { ERROR } from "@features/pokemons/pokemonsSlice"
import {
  Breadcrumbs,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material"
import { parseUrlId } from "@utils"
import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

export function PokemonDetails() {
  const params = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [pokemon, setPokemon] = useState<Pokemon>()
  const [error, setError] = useState<string>()

  console.log(navigate)

  const fetchPokemon = useCallback(async () => {
    try {
      const response = await getPokemon(Number(params.id))
      setIsLoading(false)
      setPokemon(response)
    } catch (error) {
      setError(ERROR)
    }
  }, [params.id])

  useEffect(() => {
    fetchPokemon()
  }, [fetchPokemon])

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" onClick={() => navigate(-1)}>
          Home
        </Link>
        <Typography color="text.primary">Pokemon Details</Typography>
      </Breadcrumbs>

      {isLoading && <>...Loading</>}

      {error && <>{error}</>}

      {!error && pokemon && (
        <Card variant="outlined">
          <CardMedia
            component="img"
            height="250"
            image={pokemon.sprites.front_default}
            alt="Paella dish"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {pokemon.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Moves: {pokemon.moves.map((item) => item.move.name).join(", ")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <p>
                Types:{" "}
                {pokemon.types.map((item) => (
                  <Link
                    key={item.type.name}
                    to={`/?type=${parseUrlId(item.type.url)}`}
                  >
                    {item.type.name}
                  </Link>
                ))}
              </p>
            </Typography>
          </CardContent>
        </Card>
      )}
    </>
  )
}
