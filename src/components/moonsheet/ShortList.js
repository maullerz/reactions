import React from "react";
import Helper from "./helper";

import './ShortList.css'


const ShortList = (props) => {
  const { item, getProfit, isUnref, refineryType, hundredRuns } = props
  const profit = getProfit(item, props)
  const outputValue = Helper.price(profit)
  const percColor = profit >= 0 ? "txt-yellow b" : "profit-minus"

  const reactionProfit = Helper.reactionProfit(profit / (hundredRuns ? 100 : 1), isUnref, refineryType)
  const outputValueLifeblood = Helper.price(reactionProfit)

  // const title = `${item.id}: ${item.name}`
  const title = `${item.name}`

  return (
    <div key={item.id} className="row">
      <div className="col-md-12 col-sm-12 col-xs-12 flex-between item-output-short">
        <div>
          <img
            className="img16 pen"
            alt={title}
            src={`https://image.eveonline.com/Type/${item.id}_32.png`}
          />
          {title}
        </div>
        <div className={percColor}>
          {outputValue}
        </div>
        <div className={percColor}>
          {outputValueLifeblood}
        </div>
      </div>
    </div>
  )
};

export default ShortList
