import React, { Component } from 'react'
import { Panel, ToggleButton, ToggleButtonGroup } from 'react-bootstrap'
import SheetItems from './moonsheet/SheetItems'
import { getMoonmatPrices } from '../lib/api'
import './MoonSheet.css'

const reactions = require('./reactions.json')


class MoonSheet extends Component {

  state = {
    prices: null,
    list_type: 'full',
    refinery_type: 'athanor',
  }

  componentWillMount() {
    getMoonmatPrices().then(({ data }) => {
      // console.log('data:', data)
      const buy = {}
      const sell = {}
      data.forEach(item => {
        const typeId = item.buy.forQuery.types[0]
        buy[typeId] = item.buy.max
        sell[typeId] = item.sell.min
        if (!item.buy.max) {
          console.log('zero buy:', item)
        }
        if (!item.sell.min) {
          console.log('zero sell:', item)
          // if (typeId === 16648) {
          //   buy[typeId] = 9200
          //   sell[typeId] = 10500
          // } else {
          //   console.log('zero sell:', item)
          // }
        }
      })

      const prices = { sell, buy }
      this.setState({ prices })
    })
  }

  render() {
    const { list_type, refinery_type } = this.state
    return (
      <div className='sheet-root'>
        <div className='row'>
          <div className='col-md-4 t-a_l col-first'>
            <Panel bsClass="control-panel">
              <ToggleButtonGroup type='radio' bsStyle='primary' name='list_type' defaultValue='full'>
                <ToggleButton bsStyle='primary' value='full' onClick={() => this.setState({ list_type: 'full' })}>{'Full'}</ToggleButton>
                <ToggleButton bsStyle='primary' value='short' onClick={() => this.setState({ list_type: 'short' })}>{'Short'}</ToggleButton>
              </ToggleButtonGroup>
              <ToggleButtonGroup type='radio' bsStyle='primary' name='refinery_type' defaultValue='athanor'>
                <ToggleButton value='athanor' onClick={() => this.setState({ refinery_type: 'athanor' })}>{'Athanor'}</ToggleButton>
                <ToggleButton value='tatara' onClick={() => this.setState({ refinery_type: 'tatara' })}>{'Tatara'}</ToggleButton>
              </ToggleButtonGroup>
            </Panel>
          </div>
          <div className='col-md-8 t-a_l col-last'>
            <SheetItems
              reactions={reactions}
              prices={this.state.prices}
              price_input_type='sell'
              price_output_type='sell'
              list_type={list_type}
              refinery_type={refinery_type}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default MoonSheet
