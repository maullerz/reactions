import React, { Component } from 'react'
import { forEach } from 'lodash'
import { Panel, Button, ToggleButton, ToggleButtonGroup } from 'react-bootstrap'
import SheetItems from './moonsheet/SheetItems'
import FilterPanel from './moonsheet/FilterPanel'
import { getMoonmatPrices } from '../lib/api'

const reactions = require('./reactions.json')
const stubPrices = require('./stub-prices.json')

const CACHE_TIME = 3 * 60 * 60 * 1000 // 3 hours
// const CACHE_TIME = 10 * 24 * 60 * 60 * 1000 // 10 days


class MoonSheet extends Component {

  constructor() {
    super()

    let priceStorage = null
    const timeStr = localStorage.getItem('pricesTime')
    if (timeStr) {
      const time = new Date(timeStr)
      const now = new Date()
      if (time && (now - time < CACHE_TIME)) {
        priceStorage = JSON.parse(localStorage.getItem('prices'))
      }
    }

    this.state = {
      prices: priceStorage || stubPrices,
      listType: localStorage.getItem('listType') || 'full',
      refineryType: localStorage.getItem('refineryType') || 'athanor',
      efficiency: localStorage.getItem('efficiency') === 'false' ? false : true,
      hundredRuns: JSON.parse(localStorage.getItem('hundredRuns')) || false,
    }
    if (this.state.hundredRuns) {
      this.makeHundredRuns()
    }
  }

  componentDidMount() {
    this.makeLowerCaseNames()
    const timeStr = localStorage.getItem('pricesTime')
    if (!this.state.prices || !timeStr) {
      this.updatePrices()
    }
  }

  updatePrices() {
    getMoonmatPrices().then(({ data }) => {
      const buy = {}
      const sell = {}
      data.forEach(item => {
        const typeId = item.buy.forQuery.types[0]
        // buy[typeId] = item.buy.max
        // sell[typeId] = item.sell.min
        buy[typeId] = item.buy.fivePercent
        sell[typeId] = item.sell.fivePercent
        if (!item.buy.max) {
          console.log('zero buy:', item)
        }
        if (!item.sell.min) {
          console.log('zero sell:', item)
        }
      })

      const prices = { sell, buy }
      this.setState({ prices })
      localStorage.setItem('prices', JSON.stringify({ ...prices }))
      localStorage.setItem('pricesTime', new Date())
    })
  }

  makeSingleRun() {
    forEach(reactions, item => {
      item.quantity = item.quantity / 100
      item.inputs.forEach(input => input.quantity = input.quantity / 100)
    })
  }

  makeHundredRuns() {
    forEach(reactions, item => {
      item.quantity = item.quantity * 100
      item.inputs.forEach(input => input.quantity = input.quantity * 100)
    })
  }

  makeLowerCaseNames() {
    forEach(reactions, item => {
      item.lcName = item.name.toLowerCase()
      item.inputs.forEach(input => input.lcName = input.name.toLowerCase())
    })
  }

  handleFilter = filterValue => {
    this.setState({ filterValue })
  }

  toggleEfficiency = () => {
    const { efficiency } = this.state
    this.setState({ efficiency: !efficiency })
    localStorage.setItem('efficiency', JSON.stringify(!efficiency))
  }

  toggleRuns = () => {
    const { hundredRuns } = this.state
    this.setState({ hundredRuns: !hundredRuns })
    localStorage.setItem('hundredRuns', JSON.stringify(!hundredRuns))
    hundredRuns ? this.makeSingleRun() : this.makeHundredRuns()
  }

  toggleListType = event => {
    const listType = event.target.value
    if (listType) {
      this.setState({ listType }, localStorage.setItem('listType', listType))
    }
  }

  toggleRefineryType = event => {
    const refineryType = event.target.value
    if (refineryType) {
      this.setState({ refineryType }, localStorage.setItem('refineryType', refineryType))
    }
  }

  render() {
    const { listType, refineryType, efficiency, filterValue, hundredRuns } = this.state
    const effStr = efficiency ? '2.2% ME' : '0% ME'
    return (
      <div className='sheet-root'>
        <div className='row'>
          <FilterPanel
            isOpened={this.props.filterOpened}
            onFilter={this.handleFilter}
          />
          <div className='col-md-4 t-a_l col-first'>
            <Panel bsClass="control-panel">
              <ToggleButtonGroup
                bsSize='small' type='radio' bsStyle='primary'
                name='listType' defaultValue={listType}
              >
                <ToggleButton bsStyle='primary' value='full' onClick={this.toggleListType}>{'Full'}</ToggleButton>
                <ToggleButton bsStyle='primary' value='short' onClick={this.toggleListType}>{'Short'}</ToggleButton>
              </ToggleButtonGroup>
              <ToggleButtonGroup
                bsSize='small' type='radio' bsStyle='primary'
                name='refineryType' defaultValue={refineryType}
              >
                <ToggleButton value='athanor' onClick={this.toggleRefineryType}>{'Athanor'}</ToggleButton>
                <ToggleButton value='tatara' onClick={this.toggleRefineryType}>{'Tatara'}</ToggleButton>
              </ToggleButtonGroup>
              <Button
                bsSize='small'
                onClick={this.toggleEfficiency}
                style={{ paddingLeft: 4, paddingRight: 4 }}
                active={efficiency}
              >
                {effStr}
              </Button>
              <Button
                bsSize='small'
                onClick={this.toggleRuns}
                style={{ paddingLeft: 4, paddingRight: 4 }}
                active={hundredRuns}
              >
                {hundredRuns ? '100 runs' : '1 run'}
              </Button>
            </Panel>
          </div>
          <div className='col-md-8 t-a_l col-last'>
            <SheetItems
              reactions={reactions}
              prices={this.state.prices}
              price_input_type='sell'
              price_output_type='sell'
              listType={listType}
              refineryType={refineryType}
              efficiency={efficiency}
              filter={filterValue}
              hundredRuns={hundredRuns}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default MoonSheet
