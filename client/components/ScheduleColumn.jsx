import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { startBooking } from '../actions/bookings'
// import {ModalContainer, ModalDialog} from 'react-modal-dialog'

class ScheduleColumn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showDetails: false,
      selectedDate: null
    }
    this.getClickHandler = this.getClickHandler.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  getClickHandler (selectedBooking) {
    const { startBooking, currentBooking } = this.props

    // TODO: when a selectedBooking is provided, return an event handler
    // that shows the details (modal) of the booking that was selected.
    // It will setState({ showDetails: true })

    return e => {
      const dateString = e.target.id.substr(4)
      const selectedDate = moment(dateString, 'YYYY-MM-DD-HH-mm')

      if (currentBooking.startDate) {
        if (selectedDate.isBefore(currentBooking.startDate)) {
          startBooking(selectedDate, currentBooking.endDate)
        } else if (selectedDate.isAfter(currentBooking.endDate)) {
          startBooking(currentBooking.startDate, addThirty(selectedDate))
        } else if (isWithinHours(selectedDate, currentBooking.startDate, 2)) {
          startBooking(selectedDate, currentBooking.endDate)
        } else if (isWithinHours(currentBooking.endDate, selectedDate, 2)) {
          startBooking(currentBooking.startDate, addThirty(selectedDate))
        } else {
          startBooking(selectedDate, addThirty(selectedDate))
        }
      } else {
        startBooking(selectedDate, addThirty(selectedDate))
      }

      this.setState({
        selectedDate: selectedDate
      })
    }

    function addThirty (date) {
      return moment(date).add(30, 'minutes')
    }

    function isWithinHours (date1, date2, hours) {
      const diff = date1.diff(date2, 'hours')
      return diff <= hours
    }
  }

  handleClose () {
    this.setState({
      showDetails: false
    })
  }

  render () {
    return (
      <div className={`schedule-column-container ${this.props.dayClass}`} >
        {this.getTimeSlots(moment(this.props.date))}
        {this.state.showDetails &&
        <div>
          <table className='detailsTable'>
            <tr>
              <td><b>Name</b></td>
              <td>{this.state.booking.fullName}</td>
            </tr>
            <tr>
              <td><b>Email</b></td>
              <td>{this.state.booking.emailAddress}</td>
            </tr>
            <tr>
              <td><b>Phone</b></td>
              <td>{this.state.booking.phoneNumber}</td>
            </tr>
            <tr>
              <td><b>Purpose</b></td>
              <td>{this.state.booking.purpose}</td>
            </tr>
            <tr>
              <td><b>Requested on</b></td>
              <td>{moment(this.state.booking.dateAdded).format('YYYY-MM-DD HH:mm')}</td>
            </tr>
            <tr>
              <td><b>Start</b></td>
              <td>{moment(this.state.booking.startDate).format('YYYY-MM-DD HH:mm')}</td>
            </tr>
            <tr>
              <td><b>End</b></td>
              <td>{moment(this.state.booking.endDate).format('YYYY-MM-DD HH:mm')}</td>
            </tr>
            <tr>
              <td><b>Booking Confirmed</b></td>
              <td>{this.state.booking.confirmed ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td><b>Delete Requested</b></td>
              <td>{this.state.booking.deleteRequested ? 'Yes' : 'No'}</td>
            </tr>
          </table>
        </div>
        }
      </div>
    )
  }

  getTimeSlots (d) {
    const dayArray = []
    const { startDate, endDate } = this.props.currentBooking

    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 2; j++) {
        const classNames = ['slot']
        const currentDate = moment([d.year(), d.month(), d.date(), i + 6, j * 30])
        classNames.push(j === 1 ? 'half-hour' : 'full-hour')

        const dateFormatted = moment(currentDate).format('YYYY-MM-DD-HH-mm')
        if (currentDate.isSameOrAfter(startDate) && currentDate.isBefore(endDate)) {
          classNames.push('selected')
        }

        const booking = this.props.bookings.find(booking => {
          return booking.startDate.isSameOrBefore(currentDate) &&
            booking.endDate.isAfter(currentDate)
        })
        if (booking) {
          classNames.push(booking.confirmed ? 'confirmed' : 'reserved')
        }

        let label = ''
        if (currentDate.isSame(startDate)) label = startDate.format('HH:mm')
        if (currentDate.isSame(endDate)) label = endDate.format('HH:mm')

        dayArray.push(<div
          key={dateFormatted}
          id={`slot${dateFormatted}`}
          className={classNames.join(' ')}
          onClick={this.getClickHandler(booking)}>
          <div className='titleofevent'>{label}</div>
        </div>)
      }
    }
    return dayArray
  }
}

function mapStateToProps (state) {
  return {
    currentBooking: state.booking,
    bookings: state.bookings.filter(booking => !booking.deleteRequested)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    startBooking: (startDate, endDate) => dispatch(startBooking({ startDate, endDate }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleColumn)
