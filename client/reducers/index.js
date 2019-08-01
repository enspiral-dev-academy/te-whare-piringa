import { combineReducers } from 'redux'

import booking from './booking'
import bookings from './bookings'
import date from './date'
import error from './error'
import user from './user'
import waiting from './waiting'

export default combineReducers({
  booking,
  bookings,
  date,
  error,
  user,
  waiting
})
