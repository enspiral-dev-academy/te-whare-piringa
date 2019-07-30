import { register, signIn, logOff } from 'authenticare/client'

import { makeRequest } from '../api'
import { showError } from './errors'
import { sendingRequest, gotResponse } from './requests'

export function submitRegistration (registrationInfo, redirect) {
  return dispatch => {
    dispatch(sendingRequest())
    register({
      username: registrationInfo.email,
      password: registrationInfo.password
    })
      .then(token => {
        dispatch(gotResponse())
        dispatch(loggedIn(token))
        redirect('/calendar')
      })
      .catch(err => showError(err))
  }
}

export function logIn (user) {
  return dispatch => {
    dispatch(sendingRequest())
    signIn({
      username: user.emailAddress,
      password: user.password
    })
      .then(user => dispatch(loggedIn(user)))
      .catch(err => showError(err))
  }
}

export function makeAdmin (email) {
  return dispatch => {
    dispatch(sendingRequest())
    makeRequest(`/admin/makeadmin/${email}`, 'put')
      .then(res => {
        dispatch(gotResponse())
      })
      .catch(err => showError(err))
  }
}

export function signOff () {
  logOff()
  return {
    type: 'SIGNING_OFF'
  }
}

function loggedIn (token) {
  return {
    type: 'LOGGING_IN',
    user: token
  }
}
