import moment from 'moment'

import { makeRequest } from '../api'
import { showError } from './errors'
import { sendingRequest, gotResponse } from './requests'

export const SWITCH_DATE = 'SWITCH_DATE'
export const START_BOOKING = 'START_BOOKING'
export const RECEIVE_BOOKINGS = 'RECEIVE_BOOKINGS'

export function getBookings () {
  return dispatch => {
    dispatch(sendingRequest())
    makeRequest('/bookings')
      .then(res => dispatch(receiveBookings(res.body)))
      .catch(err => dispatch(showError(err)))
      .finally(() => dispatch(gotResponse()))
  }
}

export function addBooking (booking) {
  return dispatch => {
    dispatch(sendingRequest())
    makeRequest('/bookings', 'post', booking)
      .then(res => {
        dispatch(startBooking(res.body.booking))
        dispatch(receiveBookings(res.body.bookings))
      })
      .catch(err => dispatch(showError(err)))
      .finally(() => dispatch(gotResponse()))
  }
}

export function confirmBooking (id) {
  return dispatch => {
    dispatch(sendingRequest())
    makeRequest(`/bookings/confirm/${id}`, 'put')
      .then(res => {
        dispatch(startBooking(res.body.booking))
        dispatch(receiveBookings(res.body.bookings))
      })
      .catch(err => dispatch(showError(err)))
      .finally(() => dispatch(gotResponse()))
  }
}

export function deleteBooking (booking) {
  return dispatch => {
    dispatch(sendingRequest())
    makeRequest('/bookings', 'delete', booking)
      .then(res => dispatch(receiveBookings(res.body.bookings)))
      .catch(err => dispatch(showError(err)))
      .finally(() => dispatch(gotResponse()))
  }
}

export function startBooking (booking) {
  return {
    type: START_BOOKING,
    booking: booking
  }
}

export function receiveBookings (bookings = []) {
  const cleanBookings = bookings.map(booking => ({
    ...booking,
    dateAdded: moment(booking.dateAdded._d),
    startDate: moment(booking.startDate._d),
    endDate: moment(booking.endDate._d)
  }))

  cleanBookings.sort((a, b) => a.startDate - b.startDate)

  return {
    type: RECEIVE_BOOKINGS,
    bookings: cleanBookings
  }
}

export function switchDate (date) {
  return {
    type: SWITCH_DATE,
    date
  }
}

export function selectBooking (booking) {
  return {
    type: START_BOOKING,
    booking
  }
}
