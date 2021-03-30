import React from 'react'
import { map, startsWith } from 'lodash'
import Helper from "./helper"
import OneItem from './OneItem'
import refinedOutputs from './refinedOutputs.json'

// components
import ShortList from './ShortList'

const ReprocessRatio = 0.50
const ScrapmetalSkill = 1.1
const ApproximateFuelCost = 90000

const getProfit = (item, props) => {
  const { price_input_type, price_output_type, prices, efficiency, includeFuel, hundredRuns } = props
  let inputAmount = 0
  if (!item.inputs) {
    // debugger
    console.error('error item:', item)
  }
  const eff = efficiency ? 0.978 : 1
  const runs = hundredRuns ? 100 : 1
  item.inputs.forEach((v, i) => {
    inputAmount += Math.ceil((v.quantity * prices[price_input_type][v.id] * 100 * eff) / 100)
  })
  let amount = item.quantity * prices[price_output_type][item.id]
  const fuelCost = includeFuel ? ApproximateFuelCost : 0
  const profit = amount - inputAmount
  return profit - (fuelCost * runs)
}

const getUnrefProfit = (item, props) => {
  const { price_input_type, price_output_type, prices, efficiency, includeFuel, hundredRuns } = props
  let inputAmount = 0
  const eff = efficiency ? 0.978 : 1
  const runs = hundredRuns ? 100 : 1
  item.inputs.forEach(v => {
    inputAmount += Math.ceil((v.quantity * prices[price_input_type][v.id] * 100 * eff) / 100)
  })
  let outputAmount = 0
  const outputs = refinedOutputs[item.id]
  outputs.forEach(refOutputItem => {
    const amount = Math.trunc(runs * refOutputItem.quantity * ReprocessRatio * ScrapmetalSkill)
    outputAmount += prices[price_output_type][refOutputItem.typeId] * amount
  })
  const fuelCost = includeFuel ? ApproximateFuelCost : 0
  const profit = outputAmount - inputAmount
  return profit - (fuelCost * runs)
}

const sortCalcFunc = (typeId, reactions, props) => {
  const item = reactions[typeId]
  const isUnref = startsWith(item.name, 'Unref')
  const profit = isUnref ? getUnrefProfit(item, props) : getProfit(item, props)
  return Helper.reactionProfit(profit, isUnref, props.refinery_type)
}


class SheetItems extends React.Component {

  sortReactions(reactions) {
    return Object.keys(reactions).sort((a, b) => {
      const diffA = sortCalcFunc(a, reactions, this.props)
      const diffB = sortCalcFunc(b, reactions, this.props)
      // console.log(diffB - diffA, diffB, diffA)
      return diffB - diffA
    })
  }

  getReactionsList(sortedReactionsIds, reactions) {
    const {
      filter, price_input_type, price_output_type,
      prices, listType, refineryType, efficiency,
      hundredRuns, includeFuel,
    } = this.props
    if (reactions.length === 0) {
      return null
    }

    const resultList = map(sortedReactionsIds, typeId => {
      const item = reactions[typeId]

      // New Reactions
      // if (typeId < 57490) {
      //   return null
      // }

      if (filter) {
        const matchedOutput = item.lcName.indexOf(filter) >= 0
        if (listType === 'short' && !matchedOutput) {
          return null
        }
        const matchedInputs = item.inputs.find(input => input.lcName.indexOf(filter) >= 0)
        if (!matchedInputs && !matchedOutput) {
          return null
        }
      }

      const isUnref = startsWith(item.name, 'Unref')

      // Without unref
      // if (!isUnref) return null

      if (listType === 'full')
        return (
          <OneItem
            key={typeId}
            item={item}
            refineryType={refineryType}
            isUnref={isUnref}
            getProfit={isUnref ? getUnrefProfit : getProfit}
            getProfitFunc={isUnref => isUnref ? getUnrefProfit : getProfit}
            prices={prices}
            reactions={reactions}
            price_input_type={price_input_type}
            price_output_type={price_output_type}
            efficiency={efficiency}
            hundredRuns={hundredRuns}
            includeFuel={includeFuel}
          />
        )
      else
        return (
          <ShortList
            key={typeId}
            item={item}
            refineryType={refineryType}
            isUnref={isUnref}
            getProfit={isUnref ? getUnrefProfit : getProfit}
            prices={prices}
            price_input_type={price_input_type}
            price_output_type={price_output_type}
            efficiency={efficiency}
            hundredRuns={hundredRuns}
            includeFuel={includeFuel}
          />
        )
    })


    // console.log('reactions:', reactions)
    const sheetTitle = this.renderHeader(listType)

    return (
      <div className="row">
        <div className="col-md-12">
          <table className="inside">
            <thead>
            <tr>
              <th>{sheetTitle}</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td colSpan="2" className="inside-table">
                {resultList}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  renderHeader(listType) {
    if (listType === 'full') {
      return (
        <div className="item-output-short header">
          <div>Output & Inputs</div>
          <div>Profit per Cycle</div>
          <div>Profit per Hour</div>
          <div>Output Cost</div>
        </div>
      )
    }
    return (
      <div className="col-md-12 col-sm-12 col-xs-12 flex-between item-output-short header">
        <div>Output</div>
        <div>Profit per Cycle</div>
        <div>Profit per Hour</div>
      </div>
    )
  }

  render() {
    const { reactions, prices } = this.props
    if (!prices) return null
    const sortedReactions = this.sortReactions(reactions)
    return this.getReactionsList(sortedReactions, reactions)
  }
}

// export default connect(state => state.moonSheetReducer, {})(SheetItems)
export default SheetItems
