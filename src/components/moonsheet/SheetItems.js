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
  item.input.forEach((v, i) => {
    inputAmount += v.quantity * prices[price_input_type][v.item_id]
  })
  let amount = prices[price_output_type][item.item_id] * item.quantity
  return amount - inputAmount
}

const getUnrefProfit = (item, props) => {
  const {price_input_type, price_output_type, prices} = props
  let inputAmount = 0
  item.input.forEach(v => {
    inputAmount += v.quantity * prices[price_input_type][v.item_id]
  })
  let outputAmount = 0
  const outputs = refinedOutputs[item.item_id]
  outputs.forEach(item => {
    const amount = Math.trunc(item.quantity * ReprocessRatio * ScrapmetalSkill)
    outputAmount += prices[price_output_type][item.typeId] * amount
  })
  return outputAmount - inputAmount
}

const sortCalcFunc = (item, props) => {
  const isUnref = startsWith(item.item_name, 'Unref')
  const profit = isUnref ? getUnrefProfit(item, props) : getProfit(item, props)
  return Helper.reactionProfit(profit, isUnref)
}

class SheetItems extends React.Component {
  sortReactions(reactions) {
    return reactions.sort((a, b) => {
      const diffA = sortCalcFunc(a, this.props)
      const diffB = sortCalcFunc(b, this.props)
      return diffB - diffA
    })
  }

  getReactionsList(reactions) {
    const {filter, price_input_type, price_output_type, prices, list_type, refinery_type} = this.props
    if (reactions.length === 0) {
      return null
    }
    let resultList = map(reactions, (v, i) => {
      let inputItems = map(v.input, 'item_name')
      inputItems.push(v.item_name)
      let ftd = map(inputItems, v => v.toLowerCase())
      ftd = ftd.join(',')

      if (ftd.indexOf(String(filter).toLowerCase()) === -1) {
        return null
      }
      const isUnref = startsWith(v.item_name, 'Unref')

      // Without unref
      // if (isUnref) return null

      const FullList = <OneItem
        key={i}
        item={v}
        refinery_type={refinery_type}
        unrefined={isUnref}
        getProfit={isUnref ? getUnrefProfit : getProfit}
        prices={prices}
        price_input_type={price_input_type}
        price_output_type={price_output_type}
      />

      const shortList = <ShortList
        key={i}
        item={v}
        refinery_type={refinery_type}
        unrefined={isUnref}
        getProfit={isUnref ? getUnrefProfit : getProfit}
        prices={prices}
        price_input_type={price_input_type}
        price_output_type={price_output_type}
      />

      return list_type === 'full' ? FullList : shortList
    })


    const sheetTitle = this.renderHeader(list_type)

    // return list_type === 'full' ? <div>{resultList}</div> : (
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
    const {reactions} = this.props
    const sortedReactions = this.sortReactions(reactions)
    return this.getReactionsList(sortedReactions)
  }
}

// export default connect(state => state.moonSheetReducer, {})(SheetItems)
export default SheetItems
