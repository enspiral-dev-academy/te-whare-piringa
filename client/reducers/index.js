import { combineReducers } from 'redux'

import user from './user'
import redirectTo from './redirect'
import booking from './booking'
import display from './display'
import bookings from './bookings'
import unconfirmed from './unconfirmed'
import adminSuccess from './adminsuccess'
import error from './error'
import waiting from './waiting'
import newBooking from './newBooking'
import mouse from './mouse'
import errors from './errors'

export default combineReducers({
  user,
  redirectTo,
  booking,
  display,
  bookings,
  unconfirmed,
  adminSuccess,
  error,
  waiting,
  newBooking,
  mouse,
  errors
})
