import request from 'superagent'

import { getAuthorizationHeader } from 'authenticare/client'

const baseUrl = '/api/v1'

export function makeRequest (endpoint, method = 'get', data = {}) {
  const dataMethod = method.toLowerCase() === 'get' ? 'query' : 'send'
  const acceptJsonHeader = {
    Accept: 'application/json'
  }

  return request[method](baseUrl + endpoint)
    .set(getAuthorizationHeader())
    .set(acceptJsonHeader)[dataMethod](data)
    .catch(err => {
      throw err
    })
}
