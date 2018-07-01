import React, { Component } from 'react'
import MoonSheet from './components/MoonSheet'

import "./styles/reset.css"
import "./styles/bootstrap.css"
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import "./styles/main.css"

import './App.css'


function SearchIcon(props) {
  return (
    <div
      className="searchIcon"
      style={{ opacity: props.filterOpened ? 1 : 0.3 }}
      onClick={props.handleClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="1225 1246 23 23">
        <path fill="white" fillRule="evenodd" d="M1242.388 1265.302a10.735 10.735 0 0 1-6.607 2.26c-5.954 0-10.781-4.826-10.781-10.78 0-5.955 4.827-10.782 10.781-10.782 5.955 0 10.782 4.827 10.782 10.781 0 2.49-.844 4.782-2.261 6.607.145.068.282.163.402.283l2.875 2.875a1.438 1.438 0 0 1-2.033 2.033l-2.875-2.875a1.435 1.435 0 0 1-.283-.402zm-6.607-.614a7.906 7.906 0 1 0 0-15.813 7.906 7.906 0 0 0 0 15.813z"/>
      </svg>
    </div>
  )
}


class App extends Component {
  state = {
    filterOpened: true,
  }

  toggleFilter = () => {
    this.setState({ filterOpened: !this.state.filterOpened })
  }

  render() {
    const { filterOpened } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Composite Reactions Chart</h1>
          <SearchIcon
            filterOpened={filterOpened}
            handleClick={this.toggleFilter}
          />
        </header>
        <MoonSheet filterOpened={filterOpened} />
      </div>
    )
  }
}

export default App
