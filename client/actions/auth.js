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
      .then(() => makeRequest('/profile')
        .then(res => {
          const { details, pastBookings } = res.body
          const authenticatedUser = { details, pastBookings }
          dispatch(loggedIn(authenticatedUser))
          callback(authenticatedUser)
          return authenticatedUser
        })
      )
      .catch(err => dispatch(showError(err)))
      .finally(() => dispatch(gotResponse()))
  }
}

export function logIn (user, callback) {
  return dispatch => {
    dispatch(sendingRequest())
    signIn({
      username: user.emailAddress,
      password: user.password
    }, { baseUrl })
      .then(() => makeRequest('/profile')
        .then(res => {
          const { details, pastBookings } = res.body
          const authenticatedUser = { details, pastBookings }
          dispatch(loggedIn(authenticatedUser))
          callback(authenticatedUser)
        })
      )
      .catch(err => dispatch(showError(err)))
      .finally(() => dispatch(gotResponse()))
  }
}

export function getUserProfile (showErrors) {
  return dispatch => {
    dispatch(sendingRequest())
    makeRequest('/profile')
      .then(res => {
        const { details, pastBookings } = res.body
        const authenticatedUser = { details, pastBookings }
        dispatch(loggedIn(authenticatedUser))
      })
      .catch(err => showErrors && dispatch(showError(err)))
      .finally(() => dispatch(gotResponse()))
  }
}

export function makeAdmin (email) {
  return dispatch => {
    dispatch(sendingRequest())
    makeRequest(`/admin/makeadmin/${email}`, 'put')
      .then(res => dispatch(gotResponse()))
      .catch(err => dispatch(showError(err)))
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
