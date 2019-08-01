import { START_BOOKING } from '../actions/bookings'

export default function (booking = {}, action) {
  switch (action.type) {
    case START_BOOKING:
      return action.booking

    default:
      return booking
  }
}
