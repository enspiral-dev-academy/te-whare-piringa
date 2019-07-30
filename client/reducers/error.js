import { SHOW_ERROR, CLEAR_ERROR } from '../actions/errors'

export default function (error = '', action) {
  switch (action.type) {
    case SHOW_ERROR:
      return action.message

    case CLEAR_ERROR:
      return action.message

    default:
      return error
  }
}
