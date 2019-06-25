import { BOOKINGPOSTED } from '../actions/index'
const initialState = {}

const booking = (state = initialState, action) => {
  switch (action.type) {
    case BOOKINGPOSTED:
      return action.booking
    default:
      return state
  }
}

export default booking
