import { register, signIn, logOff } from 'authenticare/client'

import { showError } from './errors'
import { makeRequest } from '../api'
import { sendingRequest, gotResponse } from './requests'
import { apiBaseUrl as baseUrl } from '../../shared/config'

export const LOGGED_IN = 'LOGGED_IN'
export const SIGNED_OFF = 'SIGNED_OFF'

export function submitRegistration (user, callback) {
  const { emailAddress, password, fullName, phoneNumber } = user
  return dispatch => {
    dispatch(sendingRequest())
    register({
      username: emailAddress,
      phoneNumber,
      emailAddress,
      fullName,
      password
    }, { baseUrl })
      .then(token => {
        return makeRequest('/profile')
          .then(res => {
            const { user: details, bookings } = res.body
            const authenticatedUser = { token, details, bookings }
            dispatch(loggedIn(authenticatedUser))
            dispatch(gotResponse())
            callback(authenticatedUser)
            return authenticatedUser
          })
      })
      .catch(err => showError(err))
  }
}

export function logIn (user, callback) {
  return dispatch => {
    dispatch(sendingRequest())
    signIn({
      username: user.emailAddress,
      password: user.password
    }, { baseUrl })
      .then(token => {
        return makeRequest('/profile')
          .then(res => {
            const { user: details, bookings } = res.body
            const authenticatedUser = { token, details, bookings }
            dispatch(loggedIn(authenticatedUser))
            dispatch(gotResponse())
            callback(authenticatedUser)
            return authenticatedUser
          })
      })
      .catch(err => showError(err))
  }
}

export function getUserProfile (username) {
  return dispatch => {
    dispatch(sendingRequest())
    return makeRequest('/profile')
      .then(token => {
        return makeRequest('/profile')
          .then(res => {
            const { user: details, bookings } = res.body
            const authenticatedUser = { token, details, bookings }
            dispatch(loggedIn(authenticatedUser))
            dispatch(gotResponse())
            return authenticatedUser
          })
      })
      .catch(err => showError(err))
  }
}

export function makeAdmin (email) {
  return dispatch => {
    dispatch(sendingRequest())
    makeRequest(`/admin/makeadmin/${email}`, 'put')
      .then(res => dispatch(gotResponse()))
      .catch(err => showError(err))
  }
}

export function signOff () {
  logOff()
  return {
    type: SIGNED_OFF
  }
}

function loggedIn (user) {
  return {
    type: LOGGED_IN,
    user: user
  }
}
