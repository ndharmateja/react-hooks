// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {PokemonForm} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

const IDLE = 'idle'
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  )
}

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
      throw error
    default:
      throw new Error("This shouldn't happen")
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
        <ErrorBoundary
          onReset={() => setPokemonName('')}
          FallbackComponent={ErrorFallback}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
