import React from 'react'
import Modal from 'react-modal'
import { connect } from 'react-redux'
import moment from 'moment'

import { showBooking, startBooking } from '../actions/bookings'

const modalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

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
    const { showBooking, startBooking, currentBooking } = this.props

    // When a selectedBooking is provided, return an event handler
    // that shows the details (modal) of the booking that was selected.
    if (selectedBooking) {
      return e => {
        showBooking(selectedBooking)
        this.setState({ showDetails: true })
      }
    }

    // Otherwise, return an event handler that alters either
    // the startDate or the endDate based on the selectedDate.
    return e => {
      const dateString = e.target.id.substr(4)
      const selectedDate = moment(dateString, 'YYYY-MM-DD-HH-mm')

      if (currentBooking.startDate) {
        if (selectedDate.isBefore(currentBooking.startDate)) {
          startBooking({
            startDate: selectedDate,
            endDate: currentBooking.endDate
          })
        } else if (selectedDate.isAfter(currentBooking.endDate)) {
          startBooking({
            startDate: currentBooking.startDate,
            endDate: addThirty(selectedDate)
          })
        } else if (isWithinHours(selectedDate, currentBooking.startDate, 2)) {
          startBooking({
            startDate: selectedDate,
            endDate: currentBooking.endDate
          })
        } else if (isWithinHours(currentBooking.endDate, selectedDate, 2)) {
          startBooking({
            startDate: currentBooking.startDate,
            endDate: addThirty(selectedDate)
          })
        } else {
          startBooking({
            startDate: selectedDate,
            endDate: addThirty(selectedDate)
          })
        }
      } else {
        startBooking({
          startDate: selectedDate,
          endDate: addThirty(selectedDate)
        })
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
    this.props.startBooking({})
    this.setState({
      showDetails: false
    })
  }

  render () {
    const {
      fullName,
      phoneNumber,
      emailAddress,
      purpose,
      confirmed,
      deleteRequested,
      startDate = moment(),
      endDate = moment(),
      dateAdded = moment()
    } = this.props.currentBooking
    return (
      <div className={`schedule-column-container ${this.props.dayClass}`} >
        {this.getTimeSlots(moment(this.props.date))}
        <Modal
          style={modalStyle}
          isOpen={this.state.showDetails}
          onRequestClose={this.handleClose}>
          <div>
            <table className='detailsTable'>
              <tbody>
                {fullName && <tr>
                  <td><b>Name</b></td>
                  <td>{fullName}</td>
                </tr>}
                {emailAddress && <tr>
                  <td><b>Email</b></td>
                  <td>{emailAddress}</td>
                </tr>}
                {phoneNumber && <tr>
                  <td><b>Phone</b></td>
                  <td>{phoneNumber}</td>
                </tr>}
                {purpose && <tr>
                  <td><b>Purpose</b></td>
                  <td>{purpose}</td>
                </tr>}
                <tr>
                  <td><b>Start</b></td>
                  <td>{startDate.format('YYYY-MM-DD HH:mm')}</td>
                </tr>
                <tr>
                  <td><b>End</b></td>
                  <td>{endDate.format('YYYY-MM-DD HH:mm')}</td>
                </tr>
                <tr>
                  <td><b>Requested on</b></td>
                  <td>{dateAdded.format('YYYY-MM-DD HH:mm')}</td>
                </tr>
                <tr>
                  <td><b>Booking Confirmed</b></td>
                  <td>{confirmed ? 'Yes' : 'No'}</td>
                </tr>
                <tr>
                  <td><b>Delete Requested</b></td>
                  <td>{deleteRequested ? 'Yes' : 'No'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
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
    showBooking: booking => dispatch(showBooking(booking)),
    startBooking: booking => dispatch(startBooking(booking))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleColumn)
