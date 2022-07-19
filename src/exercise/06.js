// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonForm} from '../pokemon'

const IDLE = 'idle'
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })
  const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!pokemonName) return

    setState({status: PENDING})
    fetchPokemon(pokemonName).then(
      pokemon =>
        setState({
          pokemon,
          status: RESOLVED,
        }),
      error =>
        setState({
          error,
          status: REJECTED,
        }),
    )
  }, [pokemonName])

  switch (status) {
    case IDLE:
      return <p>Submit a pokemon</p>
    case PENDING:
      return <PokemonInfoFallback name={pokemonName} />
    case RESOLVED:
      return <PokemonDataView pokemon={pokemon} />
    case REJECTED:
      return (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
      )
    default:
      return null
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
