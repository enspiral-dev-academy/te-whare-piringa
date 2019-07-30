import React from 'react'

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
      [e.target.name]: e.target.value
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    const loginInfo = {
      emailAddress: this.state.emailAddress.trim(),
      password: this.state.password.trim()
    }
    this.props.submitRegistration(loginInfo, this.props.history.push)
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

export default Login
