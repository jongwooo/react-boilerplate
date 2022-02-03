import React from 'react'
import { hot } from 'react-hot-loader'
import logo from './logo.png'

const App = () => {
    return(
        <div className="App">
            <h1>Hello, World!</h1>
            <img src={logo}  alt="logo"/>
        </div>
    )
}

export default hot(module)(App)
