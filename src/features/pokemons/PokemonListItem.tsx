import { Card, CardContent, Typography } from "@mui/material"
import { Link } from "react-router-dom"

type Props = {
  id: number
  name: string
  type: string
}

export const PokemonsListItem = (props: Props) => {
  const { id, name, type } = props

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          <Link to={`/pokemon/${id}`}>{name}</Link>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Types: {type}
        </Typography>
      </CardContent>
    </Card>
  )
}
