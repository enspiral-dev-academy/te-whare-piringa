import { LOGGED_IN } from '../actions/auth'
import { SHOW_ERROR } from '../actions/errors'
import { SENDING_REQUEST, GOT_RESPONSE } from '../actions/requests'

export default function (waiting = false, action) {
  switch (action.type) {
    case SENDING_REQUEST:
      return true
    case GOT_RESPONSE:
      return false
    case LOGGED_IN:
      return false
    case SHOW_ERROR:
      return false
    default:
      return waiting
  }
}
