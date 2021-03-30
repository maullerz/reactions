import React from "react"
import { map, find, startsWith } from "lodash"
import Helper from "./helper"

import refinedOutputs from './refinedOutputs.json'
import './OneItem.css'

const ReprocessRatio = 0.52
const ScrapmetalSkill = 1.1


const getReaction = (name, list) => find(list, { name: name })


const OneItem = (props) => {
  const {
    item,
    prices,
    price_input_type,
    price_output_type,
    getProfit,
    getProfitFunc,
    isUnref,
    refineryType,
    efficiency,
    reactions,
    hundredRuns,
  } = props
  const price_input = prices[price_input_type]
  const price_output = prices[price_output_type]
  const eff = efficiency ? 0.978 : 1

  let inputItemsSum = 0
  const inputItems = map(item.inputs, (v, i) => {
    const effQuantity = Math.ceil(v.quantity * eff)
    const inputCost = effQuantity * price_input[v.id]
    inputItemsSum += inputCost

    // components profit
    const reaction = getReaction(v.name, reactions)
    if (reaction) {
      var isUnref = startsWith(v.name, 'Unref')
      var profit = getProfitFunc(isUnref)(reaction, props)
      var outputValue = Helper.price(profit)
      // var percColor = profit >= 0 ? "txt-yellow" : "profit-minus"
      // Lifeblood Athanor
      var reactionProfit = Helper.reactionProfit(profit / (hundredRuns ? 100 : 1), isUnref, refineryType)
      var componentProfit = Helper.price(reactionProfit)
    }

    // const title = `${v.name} ${effQuantity} x ${Helper.price(price_input[v.id])} isk`
    const title = `${v.name} x ${effQuantity}`

    return (
      <div className="row" key={v.name}>
        <div className="col-md-12 col-sm-12 col-xs-12 flex-between">
          <span className="item-title-cell">
            {/*<img className="img16 pen" alt={v.name} src={`https://image.eveonline.com/Type/${v.id}_32.png`} />*/}
            <img
              className="img16 pen"
              alt='' // {v.name}
              src={`https://img.evetools.org/sdeimages/types/${v.id}/icon?size=32`}
            />
            <span>{title}</span>
          </span>
          <span className="item-cell">{outputValue}</span>
          <span className="item-cell">{componentProfit}</span>
          <span className="item-cell">{Helper.price(inputCost)}</span>
        </div>
      </div>
    )
  })

  let outputCost = 0
  if (isUnref) {
    const outputs = refinedOutputs[item.id]
    outputs.forEach(item => {
      const outputAmount = Math.trunc(item.quantity * ReprocessRatio * ScrapmetalSkill)
      outputCost += (prices[price_output_type][item.typeId] * outputAmount)
    })
  } else if (!price_output[item.id]) {
    outputCost = null
    // console.log('inputItemsSum:', inputItemsSum)
  } else {
    outputCost = price_output[item.id] * item.quantity
  }

  const profit = getProfit(item, props)
  const outputValue = Helper.price(profit)
  const percColor = profit >= 0 ? "txt-yellow" : "profit-minus"
  // Lifeblood Athanor
  const reactionProfit = Helper.reactionProfit(profit / (hundredRuns ? 100 : 1), isUnref, refineryType)
  const outputValueLifeblood = Helper.price(reactionProfit)

  return (
    <div className="row" style={{ paddingLeft: 0, paddingRight: 0 }}>
      <div className="col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <table className="inside">
          <thead>
          <tr>
            <th>
              <div className="item-output">
                <div className="header-title">
                  <div style={{ width: 'auto' }}>
                    <img
                      className="img16 pen"
                      alt='' // {item.name}
                      //src={`https://image.eveonline.com/Type/${item.id}_32.png`}
                      src={`https://img.evetools.org/sdeimages/types/${item.id}/icon?size=32`}
                    />
                  </div>
                  <div style={{ width: '100%', textAlign: 'left' }}>
                    {`${item.name} x ${item.quantity}`}{/* ${item.id}: */}
                  </div>
                </div>
                <div className={percColor}>
                  {outputValue}
                </div>
                <div className={percColor}>
                  {outputValueLifeblood}
                </div>
                <div className="txt-normal" style={{ marginRight: 6 }}>
                  {Helper.price(outputCost, { cost: inputItemsSum, count: item.quantity })}
                </div>
              </div>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td colSpan="2" className="inside-table">
              {inputItems}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OneItem
