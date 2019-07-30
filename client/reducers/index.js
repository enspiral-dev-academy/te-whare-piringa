import { combineReducers } from 'redux'

import booking from './booking'
import bookings from './bookings'
import display from './display'
import error from './error'
import mouse from './mouse'
import newBooking from './newBooking'
import user from './user'
import waiting from './waiting'

export default combineReducers({
  booking,
  bookings,
  display,
  error,
  mouse,
  newBooking,
  user,
  waiting
})
