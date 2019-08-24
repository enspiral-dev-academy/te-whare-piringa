import { SHOW_BOOKING, START_BOOKING } from '../actions/bookings'

export default function (booking = {}, action) {
  switch (action.type) {
    case SHOW_BOOKING:
      return action.booking

    case START_BOOKING:
      return action.booking

    default:
      return booking
  }
}
