import React from 'react'
import { map, startsWith } from 'lodash'
import Helper from "./helper"
import OneItem from './OneItem'
import refinedOutputs from './refinedOutputs.json'

// components
import ShortList from './ShortList'

const ReprocessRatio = 0.52
const ScrapmetalSkill = 1.1

const getProfit = (item, props) => {
  const {price_input_type, price_output_type, prices} = props
  let inputAmount = 0
  if (!item.inputs) {
    // debugger
    console.error('error item:', item)
  }
  item.inputs.forEach((v, i) => {
    inputAmount += v.quantity * prices[price_input_type][v.id]
  })
  let amount = prices[price_output_type][item.id] * item.quantity
  return amount - inputAmount
}

const getUnrefProfit = (item, props) => {
  const {price_input_type, price_output_type, prices} = props
  let inputAmount = 0
  item.inputs.forEach(v => {
    inputAmount += v.quantity * prices[price_input_type][v.id]
  })
  let outputAmount = 0
  const outputs = refinedOutputs[item.id]
  outputs.forEach(item => {
    const amount = Math.trunc(item.quantity * ReprocessRatio * ScrapmetalSkill)
    outputAmount += prices[price_output_type][item.typeId] * amount
  })
  return outputAmount - inputAmount
}

const sortCalcFunc = (typeId, reactions, props) => {
  const item = reactions[typeId]
  const isUnref = startsWith(item.name, 'Unref')
  const profit = isUnref ? getUnrefProfit(item, props) : getProfit(item, props)
  return Helper.reactionProfit(profit, isUnref)
}


class SheetItems extends React.Component {

  sortReactions(reactions) {
    return Object.keys(reactions).sort((a, b) => {
      const diffA = sortCalcFunc(a, reactions, this.props)
      const diffB = sortCalcFunc(b, reactions, this.props)
      return diffB - diffA
    })
  }

  getReactionsList(sortedReactionsIds, reactions) {
    const {filter, price_input_type, price_output_type, prices, list_type, refinery_type} = this.props
    if (reactions.length === 0) {
      return null
    }
    const resultList = map(sortedReactionsIds, typeId => {

      // FILTER
      // const inputItems = map(v.input, 'name')
      // inputItems.push(v.name)
      // let ftd = map(inputItems, v => v.toLowerCase())
      // ftd = ftd.join(',')

      // if (ftd.indexOf(String(filter).toLowerCase()) === -1) {
      //   return null
      // }

      const item = reactions[typeId]
      const isUnref = startsWith(item.name, 'Unref')

      // Without unref
      // if (isUnref) return null


      if (list_type === 'full')
        return (
          <OneItem
            key={typeId}
            item={item}
            refinery_type={refinery_type}
            unrefined={isUnref}
            getProfit={isUnref ? getUnrefProfit : getProfit}
            prices={prices}
            reactions={reactions}
            price_input_type={price_input_type}
            price_output_type={price_output_type}
          />
        )
      else
        return (
          <ShortList
            key={typeId}
            item={item}
            refinery_type={refinery_type}
            unrefined={isUnref}
            getProfit={isUnref ? getUnrefProfit : getProfit}
            prices={prices}
            price_input_type={price_input_type}
            price_output_type={price_output_type}
          />
        )
    })


    const sheetTitle = this.renderHeader(list_type)

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

  renderHeader(list_type) {
    if (list_type === 'full') {
      return (
        <div className="item-output-short">
          <div>Output & Inputs</div>
          <div>Profit per Cycle</div>
          <div>Profit per Hour</div>
          <div>Output Cost</div>
        </div>
      )
    }
    return (
      <div className="col-md-12 col-sm-12 col-xs-12 flex-between item-output-short">
        <div>Output</div>
        <div>Profit per Cycle</div>
        <div>Profit per Hour</div>
      </div>
    )
  }

  render() {
    const { reactions, prices } = this.props
    if (!prices) return null
    console.log('reactions', reactions)
    const sortedReactions = this.sortReactions(reactions)
    return this.getReactionsList(sortedReactions, reactions)
  }
}

// export default connect(state => state.moonSheetReducer, {})(SheetItems)
export default SheetItems
