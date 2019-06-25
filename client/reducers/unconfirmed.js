import { UNCONFIRMED } from '../actions/index'
const initialState = []

const unconfirmed = (state = initialState, action) => {
  switch (action.type) {
    case UNCONFIRMED:
      return action.data
    default:
      return state
  }
}

export default unconfirmed
