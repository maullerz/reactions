import React from "react"
import './FilterPanel.css'


const ClearIcon = props => {
  const className = props.isVisible
    ? "clearIcon"
    : "clearIcon hidden"
  return (
    <svg
      className={className} onClick={props.handleClick}
      xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="878 982 30 30"
    >
      <path fill="#D8D8D8" fillRule="evenodd" d="M893 1012c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15zm5.543-18.328a1.573 1.573 0 0 0-.005-2.21 1.559 1.559 0 0 0-2.21-.005L893 994.785l-3.328-3.328a1.573 1.573 0 0 0-2.21.005 1.559 1.559 0 0 0-.005 2.21l3.328 3.328-3.328 3.328a1.573 1.573 0 0 0 .005 2.21 1.559 1.559 0 0 0 2.21.005l3.328-3.328 3.328 3.328a1.573 1.573 0 0 0 2.21-.005 1.559 1.559 0 0 0 .005-2.21L895.215 997l3.328-3.328z"/>
    </svg>
  )
}


export default class FilterPanel extends React.Component {
  state = {
    value: '',
  }

  makeFilter = e => {
    this.setState(
      { value: e.target.value.toLowerCase() },
      () => this.props.onFilter(this.state.value),
    )
  }

  clearFilter = () => {
    this.setState({ value: '' })
    this.props.onFilter()
  }

  render() {
    const { isOpened } = this.props
    if (!isOpened) return null

    const { value } = this.state

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="panel-content">
            <input
              placeholder="Filter materials"
              onChange={this.makeFilter}
              className="input-search"
              style={{ fontSize: '1.5em' }}
              value={value}
            />
            <ClearIcon isVisible={value} handleClick={this.clearFilter} />
          </div>
        </div>
      </div>
    )
  }
}
