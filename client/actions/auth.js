import { makeRequest } from '../api'
import { receiveBookings, WAITING, NOT_WAITING } from './index'

const localStorage = global.window.localStorage

export function checkLogin (redirect) {
  return dispatch => {
    dispatch(gettingData())
    if (!localStorage.getItem('id_token')) {
      dispatch(noUserExists())
      return makeRequest('/getbookings')
        .then(res => {
          dispatch(receivedData())
          return dispatch(receiveBookings(res.body.bookings))
        })
    } else {
      dispatch(checkingLogin())
      return makeRequest('/checklogin')
        .then(res => {
          if (!res.body.user) {
            res.body.error && console.error(res.body.error)
            dispatch(receivedData())
            return dispatch(noUserExists())
          }
          dispatch(loggedIn(res.body.user))
          dispatch(receivedData())
          return dispatch(receiveBookings(res.body.bookings))
        })
    }
  }
}

function checkingLogin () {
  return {
    type: 'CHECKING_LOGIN'
  }
}

export const gettingData = () => {
  return {
    type: WAITING
  }
}

export const receivedData = () => {
  return {
    type: NOT_WAITING
  }
}

function noUserExists (error) {
  return {
    type: 'NO_USER',
    error
  }
}

function loggedIn (user, bookings) {
  return {
    type: 'LOGGED_IN',
    user,
    bookings
  }
}

export function submitRegistration (registrationInfo, redirect) {
  return dispatch => {
    dispatch(gettingData())
    makeRequest('/auth/register', 'post', registrationInfo)
      .then(res => {
        dispatch(receivedData())
        if (res.body.user) {
          dispatch(loggedIn(res.body.user))
          redirect('/calendar')
        }
        if (res.body.error) {
          dispatch(registrationFailed(res.body.error))
          console.error(res.body.error)
        }
      })
  }
}

function registrationFailed (error) {
  return {
    type: 'FAILED_REGISTRATION',
    error
  }
}

export function logout () {
  return dispatch => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    dispatch(loggedOut())
    dispatch(gettingData())
  }
}

function loggedOut () {
  return {
    type: 'LOGGED_OUT'
  }
}
