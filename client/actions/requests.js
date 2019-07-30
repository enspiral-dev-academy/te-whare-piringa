export const SENDING_REQUEST = 'SENDING_REQUEST'
export const GOT_RESPONSE = 'GOT_RESPONSE'

export function sendingRequest () {
  return {
    type: SENDING_REQUEST
  }
}

export function gotResponse () {
  return {
    type: GOT_RESPONSE
  }
}
