import axios from 'axios'

// const baseUrl = 'http://api.eve-prod.xyz'
// const esiUrl = 'https://esi.tech.ccp.is'
// const crestUrl = 'https://crest-tq.eveonline.com'
// const marketUrl = 'https://api.evemarketer.com/ec/marketstat/json?regionlimit=10000002&typeid=' // The Forge
// const marketUrl = 'https://api.evemarketer.com/ec/marketstat/json?usesystem=30000142&typeid=' // Jita
const marketUrl = 'https://market.fuzzwork.co.uk/aggregates/?region=10000002&types='

const MOONMAT_ITEMS = [
  16633,16634,16635,16636,16637,16638,16639,16640,16641,16642,16643,16644,16646,16647,16648,
  16649,16650,16651,16652,16653,16654,16655,16656,16657,16658,16659,16660,16661,16662,16663,
  16664,16665,16666,16667,16668,16669,16670,16671,16672,16673,16678,16679,16680,16681,16682,
  16683,17317,17769,17959,17960,33336,33337,33359,33360,33361,33362,
  4312, // Oxygen Fuel Block
  4051, // Nitrogen Fuel Block
  4246, // Hydrogen Fuel Block
  4247, // Helium Fuel Block
  57453, // Carbon Fiber
  57454, // Oxy-Organic Solvents
  57456, // Pressurized Oxidizers
  57457, // Reinforced Carbon Fiber
  57455, // Thermosetting Polymer
]
const ITEMS = MOONMAT_ITEMS.join(',')

const parseFuzzworkData = ({ data }) => {
  const itemsPrices = {}
  Object.keys(data).forEach(typeID => {
    const item = data[typeID]
    itemsPrices[typeID] = {
      buy: item.buy.percentile,
      buyFivePerc: item.buy.percentile,
      sell: item.sell.percentile,
      sellFivePerc: item.sell.percentile,
    }
  })
  return { itemsPrices }
}

export const getMoonmatPrices = () => {
  return axios.get(
    marketUrl + ITEMS,
    // { headers: { 'Access-Control-Allow-Origin': '*' } },
  )//.then(parseFuzzworkData)
}
