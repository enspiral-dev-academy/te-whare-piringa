import { BOOKING_ADDED } from '../actions/bookings'

export default function (booking = {}, action) {
  switch (action.type) {
    case BOOKING_ADDED:
      return action.booking
    default:
      return booking
  }
}
