import React, { Component } from 'react'
import MoonSheet from './components/MoonSheet'
import './App.css'


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <MoonSheet />
      </div>
    )
  }
}

export default App
