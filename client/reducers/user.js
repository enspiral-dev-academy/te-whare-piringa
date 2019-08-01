import { LOGGED_IN, SIGNED_OFF } from '../actions/auth'

const emptyUser = {}

export default function (user = emptyUser, action) {
  switch (action.type) {
    case LOGGED_IN:
      return action.user
    case SIGNED_OFF:
      return emptyUser
    default:
      return user
  }
}
