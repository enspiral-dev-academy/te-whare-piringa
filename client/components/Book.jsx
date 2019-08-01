import React from 'react'
import { connect } from 'react-redux'
import Datetime from 'react-datetime'
import { withRouter } from 'react-router-dom'

import { addBooking } from '../actions/bookings'
import { validationError } from '../actions/errors'
import { validateBookingDetails, checkBookingForOverlap } from '../../shared/validation'

const timeConstraints = {
  hours: {
    min: 6,
    max: 22,
    step: 1
  },
  minutes: {
    step: 30
  }
}

class Book extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      fullName: this.props.user.fullName,
      emailAddress: this.props.user.emailAddress,
      phoneNumber: this.props.user.phoneNumber,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      guestCount: null,
      purpose: null,
      message: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.showThankYouMessage = this.showThankYouMessage.bind(this)
    this.handleStartDateChanged = this.handleStartDateChanged.bind(this)
    this.handleEndDateChanged = this.handleEndDateChanged.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.redirect = this.redirect.bind(this)
  }

  handleChange (evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  handleClose () {
    this.props.history.push('/schedule')
  }

  handleStartDateChanged (date) {
    this.setState({
      dateStart: date
    })
  }

  handleEndDateChanged (date) {
    this.setState({
      dateEnd: date
    })
  }

  handleSubmit (evt) {
    evt.preventDefault()

    const booking = {
      fullName: this.state.fullName,
      emailAddress: this.state.emailAddress,
      phoneNumber: this.state.phoneNumber,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      purpose: this.state.purpose,
      guestCount: this.state.guestCount || 0
    }

    let message = validateBookingDetails(booking)
    if (message !== 'ok') return this.props.dispatch(validationError(message))
    message = checkBookingForOverlap(booking, this.props.bookings)
    if (message !== 'ok') return this.props.dispatch(validationError(message))
    this.props.dispatch(addBooking(booking))
    this.showThankYouMessage()
  }

  redirect () {
    this.setState({ message: '' })
    this.props.history.push('/schedule')
  }

  showThankYouMessage () {
    this.setState({
      message: "Thank you for your booking. We'll contact you soon to confirm the details."
    })
  }

  render () {
    return (
      <div className='container book-container'>
        {!this.state.message &&
        <form onSubmit={this.handleSubmit}>
          <div className="form-group row">
            <label className="col-xs-3">Full Name:</label>
            <div className="col-xs-9">
              <input name='fullName'
                className="form-control col-md-10"
                value={this.props.user.fullName}
                onChange={this.handleChange} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xs-3">Email Address:</label>
            <div className="col-xs-9">
              <input name='emailAddress' type='email'
                className="form-control"
                value={this.props.user.emailAddress}
                onChange={this.handleChange} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xs-3">Contact Number:</label>
            <div className="col-xs-9">
              <input name='phoneNumber' type='tel'
                className="form-control"
                value={this.props.user.phoneNumber}
                onChange={this.handleChange} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xs-3">Start Date and Time:</label>
            <div className="col-xs-9">
              <Datetime value={this.props.startDate}
                onChange={this.handleStartDateChanged}
                timeConstraints={timeConstraints}
                className="datepick"
                dateFormat="DD/MM/YYYY"
                timeFormat="HH:mm" />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xs-3">End Date and Time:</label>
            <div className="col-xs-9">
              <Datetime value={this.props.endDate}
                onChange={this.handleEndDateChanged}
                timeConstraints={timeConstraints}
                className="datepick"
                dateFormat="DD/MM/YYYY"
                timeFormat="HH:mm" />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xs-3">Purpose:</label>
            <div className="col-xs-9">
              <textarea name='purpose' required
                placeholder='Purpose of hire'
                className="form-control"
                onChange={this.handleChange} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xs-3">Number of Guests:</label>
            <div className="col-xs-9">
              <input name='guestNumber' type='number' min='0' required
                placeholder="Type 0 (zero) if you don't know"
                className="form-control number-guest"
                onChange={this.handleChange} />
            </div>
          </div>
          <div className="form-group row text-center">
            <input type='submit' value='Request booking' className="setting-btn" />
          </div>
        </form>
        }
        {this.state.message && <h3 className="confirm-message">{this.state.message}</h3>}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    startDate: state.booking.startDate,
    endDate: state.booking.endDate,
    bookings: state.bookings,
    user: state.user.details
  }
}

export default withRouter(connect(mapStateToProps)(Book))
