type Props = {
  name: string
  type: string
}

export const PokemonsListItem = (props: Props) => {
  const { name, type } = props

  return (
    <div key={name}>
      {name} - {type}
    </div>
  )
}
