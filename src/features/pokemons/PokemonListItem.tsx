import { Link } from "react-router-dom"

type Props = {
  id: number
  name: string
  type: string
}

export const PokemonsListItem = (props: Props) => {
  const { id, name, type } = props

  return (
    <div key={name}>
      <Link to={`/pokemon/${id}`}>
        {name} - {type}{" "}
      </Link>
    </div>
  )
}
