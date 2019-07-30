import React from 'react'
import { connect } from 'react-redux'

import { submitRegistration } from '../actions/auth'

class Registration extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      fullName: '',
      phoneNumber: '',
      emailAddress: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    const registrationInfo = {
      fullName: this.state.fullName.trim(),
      phoneNumber: this.state.phoneNumber.trim(),
      emailAddress: this.state.emailAddress.trim(),
      password: this.state.password.trim()
    }
    this.props.submitRegistration(registrationInfo, this.props.history.push)
  }

  render () {
    return (
      <div className='login-page'>
        <form onSubmit={this.handleSubmit}>
          <h2>Register</h2>

          <p>
            <input name='fullName'
              placeholder='Full Name'
              className='form-control'
              onChange={this.handleChange} />
          </p>

          <p>
            <input name='phoneNumber'
              placeholder='Phone Number'
              className='form-control'
              onChange={this.handleChange} />
          </p>

          <p>
            <input name='emailAddress'
              placeholder='Email Address'
              className='form-control'
              onChange={this.handleChange} />
          </p>

          <p>
            <input name='password'
              className='form-control'
              placeholder='Password'
              onChange={this.handleChange}
              type='password' />
          </p>

          <p>
            <button className='btn btn-primary'
              onClick={this.handleSubmit}>Register</button>
          </p>
        </form>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    redirectTo: state.redirectTo
  }
}

function mapDispatchToProps (dispatch) {
  return {
    submitRegistration: (registrationInfo, redirect) => dispatch(submitRegistration(registrationInfo, redirect))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration)
