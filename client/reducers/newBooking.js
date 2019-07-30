import { NEW_BOOKING } from '../actions/bookings'

const initialBooking = {
  startDate: new Date(),
  endDate: new Date()
}

export default function (newBooking = initialBooking, action) {
  switch (action.type) {
    case NEW_BOOKING:
      return {
        startTime: action.startTime,
        endTime: action.endTime
      }
    default:
      return newBooking
  }
}
