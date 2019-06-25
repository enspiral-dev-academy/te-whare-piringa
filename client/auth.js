import auth0 from 'auth0-js'

import history from './utils/history'

import { authDomain } from '../shared/config'
import { authClientId, callbackUrl } from '../shared/vars'

const localStorage = global.window.localStorage

export default class Auth {
  constructor () {
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.handleAuthentication = this.handleAuthentication.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)

    this.auth0 = new auth0.WebAuth({
      domain: authDomain,
      clientID: authClientId,
      redirectUri: callbackUrl,
      audience: `https://${authDomain}/userinfo`,
      responseType: 'token id_token',
      scope: 'openid',
      logo: 'images/logo2.png'
    })
  }

  login () {
    this.auth0.authorize()
  }

  handleAuthentication (cb) {
    this.auth0.icon = 'http://thebookingmanager.herokuapp.com/images/logo2.png'
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
      }

      if (err) {
        // eslint-disable-next-line no-console
        console.log(err)
      }

      return cb()
    })
  }

  setSession (authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime())
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
    // navigate to the home route
    // history.replace('/home');
  }

  logout () {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    // navigate to the home route
    history.replace('/home')
  }

  isAuthenticated () {
    // Check whether the current time is past the access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt
  }
}
