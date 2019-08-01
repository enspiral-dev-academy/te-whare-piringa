import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { logIn } from '../actions/auth'

class Login extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      emailAddress: '',
      password: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (e) {
    this.setState({
      [e.target.name]: e.target.value.trim()
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    const { emailAddress, password } = this.state
    this.props.dispatch(logIn(
      { emailAddress, password },
      () => this.props.history.push('/calendar'))
    )
  }

  render () {
    return (
      <div className='login-page'>
        <form onSubmit={this.handleSubmit}>
          <h2>Log in</h2>

          <p><input name='emailAddress'
            placeholder='Email Address'
            className='form-control'
            onChange={this.handleChange}
          /></p>

          <p><input name='password'
            placeholder='Password'
            className='form-control'
            onChange={this.handleChange}
            type='password' /></p>

          <p><button className='btn btn-primary'>Login</button></p>
        </form>
      </div>
    )
  }
}

export default withRouter(connect()(Login))
