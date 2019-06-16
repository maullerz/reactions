import React, { Component, Fragment } from 'react'
import numeral from 'numeral'
import { filter, find, startsWith } from 'lodash'
import refinedOutputs from './moonsheet/refinedOutputs.json'
import './CompositeSheet.css'


const COMPOSITES = [
  16670, // Crystalline Carbonide
  16671, // Titanium Carbide
  16672, // Tungsten Carbide
  16673, // Fernite Carbide
  16678, // Sylramic Fibers
  16679, // Fullerides
  16680, // Phenolic Composites
  16681, // Nanotransistors
  16682, // Hypersynaptic Fibers
  16683, // Ferrogel
  17317, // Fermionic Condensates
  33359, // Photonic Metamaterials
  33360, // Terahertz Metamaterials
  33361, // Plasmonic Metamaterials
  33362, // Nonlinear Metamaterials
]

const getComposites = reactions => {
  const result = filter(reactions, r => COMPOSITES.includes(r.id))
  return result
}

const ReprocessRatio = 0.50
const ScrapmetalSkill = 1.1

const getProfit = (item, props) => {
  const { price_input_type, price_output_type, prices, efficiency } = props
  let inputAmount = 0
  if (!item.inputs) {
    // debugger
    console.error('error item:', item)
  }
  const eff = efficiency ? 0.978 : 1
  item.inputs.forEach((v, i) => {
    inputAmount += Math.ceil((v.quantity * prices[price_input_type][v.id] * 100 * eff) / 100)
  })
  let amount = item.quantity * prices[price_output_type][item.id]
  return amount - inputAmount
}

const getUnrefProfit = (item, props) => {
  const { price_input_type, price_output_type, prices, efficiency } = props
  let inputAmount = 0
  const eff = efficiency ? 0.978 : 1
  item.inputs.forEach(v => {
    inputAmount += Math.ceil((v.quantity * prices[price_input_type][v.id] * 100 * eff) / 100)
  })
  let outputAmount = 0
  const outputs = refinedOutputs[item.id]
  outputs.forEach(item => {
    const amount = Math.trunc(item.quantity * ReprocessRatio * ScrapmetalSkill)
    outputAmount += prices[price_output_type][item.typeId] * amount
  })
  return outputAmount - inputAmount
}

const fmt = value => numeral(value).format('0,0.0a')

export default class CompositeSheet extends Component {

  renderItem(mat, runs) {
    const { reactions, prices } = this.props
    const runsQuantity = mat.quantity * runs
    const cost = runsQuantity * prices.sell[mat.id]
    return (
      <div className='ci-moonmat-item'>
        <span className='ci-moonmat-price'>
          {fmt(cost)}
        </span>
        <span>{mat.name}</span>
        <span>{`${fmt(runsQuantity)} (${mat.quantity})`}</span>
      </div>
    )
  }

  renderInputs(inputs, runs) {
    const { reactions } = this.props
    console.log({ inputs })
    if (!inputs) {
      return null
    }
    return (
      <div className='ci-inputs'>
        {inputs.map(mat => {
          const matched = find(reactions, r => r.id === mat.id)
          return (
            <Fragment key={mat.id}>
              {this.renderItem(mat, runs)}
              {matched && matched.inputs &&
                this.renderInputs(matched.inputs, (mat.quantity / matched.quantity) * runs)
              }
            </Fragment>
          )
        })}
      </div>
    )
  }

  renderCompositeItem(data) {
    // if (data.id === 16670) {

    // }
    console.log('composite:', data)
    const runs = 100
    return (
      <div className='ci-root'>
        {this.renderItem(data, runs)}
        {this.renderInputs(data.inputs, runs)}
      </div>
    )
  }

  renderComposites() {
    const { reactions, prices } = this.props
    const composites = getComposites(reactions)
    console.log({ composites })
    return (
      <Fragment>
        {composites.map(comp => (
          <Fragment key={comp.id}>
            <div className='compositeItem'>
              {this.renderCompositeItem(comp, comp.id)}
            </div>
            <hr />
          </Fragment>
        ))}
      </Fragment>
    )
  }

  render() {
    const { prices } = this.props
    if (!prices) return null

    return (
      <div>
        {this.renderComposites()}
      </div>
    )
  }
}
