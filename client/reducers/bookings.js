import { RECEIVE_BOOKINGS } from '../actions'

const initialState = []

const bookings = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_BOOKINGS:
      return action.bookings
    default:
      return state
  }
}

export default bookings
