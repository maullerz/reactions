import axios from 'axios'
let baseUrl = 'http://api.eve-prod.xyz'
let esiUrl = 'https://esi.tech.ccp.is'
let crestUrl = 'https://crest-tq.eveonline.com'

// axios.interceptors.request.use(
//   function(config) {
//     document.getElementById('ajax_loader').style = 'display:flex'
//     return config
//   },
//   function(error) {
//     return Promise.reject(error)
//   }
// )

// // Add a response interceptor
// axios.interceptors.response.use(
//   function(response) {
//     setTimeout(
//       () => {
//         document.getElementById('ajax_loader').style = 'display:none'
//       },
//       250
//     )
//     return response
//   },
//   function(error) {
//     return Promise.reject(error)
//   }
// )


export const pricesMarketer = (systemId, items) => {
  const url = 'https://api.evemarketer.com/ec/marketstat/json?regionlimit=10000002&typeid='
  return axios.get(
    url + items,
    { headers: { 'Access-Control-Allow-Origin': '*' } },
  )
},
