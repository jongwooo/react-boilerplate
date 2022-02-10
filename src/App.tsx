import React from 'react'
import { hot } from 'react-hot-loader'
import './App.css'
import logo from './logo.png'

const App = (): JSX.Element => {
  return (
    <div className="App">
      <h1>Hello, World!</h1>
      <img className="App-logo" src={logo} alt="logo" />
    </div>
  )
}

export default hot(module)(App)
