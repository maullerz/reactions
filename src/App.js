import React, { Component } from 'react'
import MoonSheet from './components/MoonSheet'

import "./styles/reset.css"
import "./styles/bootstrap.css"
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import "./styles/main.css"

import './App.css'


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Composite Reactions Chart</h1>
        </header>
        <MoonSheet />
      </div>
    )
  }
}

export default App
