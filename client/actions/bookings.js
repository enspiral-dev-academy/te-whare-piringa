import { makeRequest } from '../api'
import { showError } from './errors'
import { sendingRequest, gotResponse } from './requests'

export const NEW_BOOKING = 'NEW_BOOKING'
export const BOOKING_ADDED = 'BOOKING_ADDED'
export const RECEIVE_BOOKINGS = 'RECEIVE_BOOKINGS'

export function getbookings (redirect) {
  return dispatch => {
    dispatch(sendingRequest())
    makeRequest('/bookings')
      .then(res => {
        dispatch(gotResponse())
        return dispatch(receiveBookings(res.body.bookings))
      })
      .catch(err => {
        dispatch(gotResponse())
        showError(err)
      })
  }
}

export function addBooking (data) {
  return dispatch => {
    dispatch(sendingRequest())
    makeRequest('/user/addbooking', 'post', data)
      .then(res => {
        if (res.body.error) return dispatch(showError(res.body.error))
        dispatch(bookingAdded(res.body.booking))
        dispatch(receiveBookings(res.body.bookings))
        dispatch(gotResponse())
      })
  }
}

export function confirmBooking (id) {
  return dispatch => {
    dispatch(sendingRequest())
    makeRequest(`/bookings/confirm/${id}`, 'put')
      .then(res => {
        dispatch(gotResponse())
        if (res.body.result) {
          res.body.bookings.find(item => {
            dispatch(receiveBookings(res.body.bookings))
          })
        }
      })
  }
}

export function deleteBooking (booking) {
  return dispatch => {
    dispatch(sendingRequest())
    makeRequest('/bookings', 'delete', booking)
      .then(res => {
        dispatch(gotResponse())
        if (res.body.bookings) {
          return dispatch(receiveBookings(res.body.bookings))
        }
      })
  }
}

export function bookingAdded (booking) {
  return {
    type: BOOKING_ADDED,
    booking: {
      startDate: new Date(booking.startDate),
      endDate: new Date(booking.endDate)
    }
  }
}

export function receiveBookings (bookings) {
  const cleanBookings = bookings.map(booking => {
    booking.startDate = new Date(booking.startDate)
    booking.endDate = new Date(booking.endDate)
    return booking
  })
  cleanBookings.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  return {
    type: RECEIVE_BOOKINGS,
    bookings: cleanBookings
  }
}

export function switchDate (date) {
  return {
    type: 'SWITCH_DATE',
    date
  }
}

export function selectBooking (booking) {
  return {
    type: BOOKING_ADDED,
    booking
  }
}
