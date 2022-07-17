// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorage = (
  key,
  initialValue,
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
  const [value, setValue] = React.useState(() => {
    const json = window.localStorage.getItem(key)
    if (!json) return initialValue
    return deserialize(json)
  })

  React.useEffect(() => {
    window.localStorage.setItem(key, serialize(value))
  }, [key, value, serialize])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorage('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
