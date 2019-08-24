import moment from 'moment'

import { makeRequest } from '../api'
import { showError } from './errors'
import { sendingRequest, gotResponse } from './requests'

export const SWITCH_DATE = 'SWITCH_DATE'
export const SHOW_BOOKING = 'SHOW_BOOKING'
export const START_BOOKING = 'START_BOOKING'
export const RECEIVE_BOOKINGS = 'RECEIVE_BOOKINGS'

export function showBooking (booking) {
  return {
    type: SHOW_BOOKING,
    booking: booking
  }
}

export function getBookings () {
  return dispatch => {
    dispatch(sendingRequest())
    makeRequest('/bookings')
      .then(res => dispatch(receiveBookings(res.body.bookings)))
      .catch(err => dispatch(showError(err)))
      .finally(() => dispatch(gotResponse()))
  }
}

export function addBooking (booking) {
  return dispatch => {
    dispatch(sendingRequest())
    makeRequest('/bookings', 'post', booking)
      .then(res => {
        dispatch(selectBooking(res.body.booking))
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
  const { startDate, endDate } = booking
  return {
    type: START_BOOKING,
    booking: {
      startDate: moment(startDate),
      endDate: moment(endDate)
    }
  }
}

export function receiveBookings (bookings = []) {
  const preparedBookings = bookings.map(booking => ({
    ...booking,
    dateAdded: moment(booking.dateAdded),
    startDate: moment(booking.startDate),
    endDate: moment(booking.endDate)
  }))

  preparedBookings.sort((a, b) => a.startDate - b.startDate)

  return {
    type: RECEIVE_BOOKINGS,
    bookings: preparedBookings
  }
}

export function switchDate (date) {
  return {
    type: SWITCH_DATE,
    date
  }
}

export function selectBooking (booking) {
  const { startDate, endDate, dateAdded } = booking
  return {
    type: START_BOOKING,
    booking: {
      ...booking,
      startDate: moment(startDate),
      endDate: moment(endDate),
      dateAdded: moment(dateAdded)
    }
  }
}

export function deselectBooking () {
  return {
    type: START_BOOKING,
    booking: {}
  }
}
