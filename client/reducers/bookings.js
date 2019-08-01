import { RECEIVE_BOOKINGS } from '../actions/bookings'

export default function (bookings = [], action) {
  switch (action.type) {
    case RECEIVE_BOOKINGS:
      return action.bookings

    default:
      return bookings
  }
}
