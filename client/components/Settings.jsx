import React from 'react'
import { connect } from 'react-redux'
// import { makeAdmin, emailAlertChange } from '../actions/index'

class Settings extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      modal: this.props.modal
    }
    this.handleAdmin = this.handleAdmin.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleEmail = this.handleEmail.bind(this)
  }

  handleAdmin (evt) {
    evt.preventDefault()
    // this.props.dispatch(makeAdmin(this.state.adminEmail))
    this.setState({ success: true })
    this.props.close()
  }

  handleChange (evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  handleEmail (evt) {
    evt.preventDefault()
    // this.props.dispatch(emailAlertChange(this.state.alertEmail))
    this.props.close()
  }

  render () {
    return (
      <div className="settings-container">
        <h2>Settings</h2>
        <form onSubmit={this.handleEmail}>
          <strong>Enter email to recieve notifications</strong>
          <p>
            Email Address<input type="text" name="alertEmail" onChange={this.handleChange} required/>
          </p>
          <button>Change</button>
        </form>
        <form onSubmit={this.handleAdmin}>
          <strong>Enter users email to make admin</strong>
          <p>Email Address<input type="text" name="adminEmail" onChange={this.handleChange} required/></p>
          <button>Make Admin</button>
        </form>
        {this.props.adminSuccess && <h2>Success</h2>}
      </div>
    )
  }
}
function mapStatetoProps (state) {
  return { adminSuccess: state.adminSuccess }
}

export default connect(mapStatetoProps)(Settings)
