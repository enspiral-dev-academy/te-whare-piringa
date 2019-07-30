import { SENDING_REQUEST, GOT_RESPONSE } from '../actions/requests'

export default function (waiting = false, action) {
  switch (action.type) {
    case SENDING_REQUEST:
      return true
    case GOT_RESPONSE:
      return false
    default:
      return waiting
  }
}
