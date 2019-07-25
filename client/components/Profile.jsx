import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'

import DetailsProfile from './DetailsProfile'
import { selectBooking, requestDelete } from '../actions/index'

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.saveBookingToStore = this.saveBookingToStore.bind(this)
  }

  saveBookingToStore (booking) {
    this.props.selectBooking(booking)
  }

  requestBookingToBeDeleted (id) {
    this.props.requestDelete(id)
  }

  showUserBookings () {
    return this.props.bookings.filter(booking => booking.authId).map((booking, i) => {
      return (
        <tr key={i}>
          <td>{moment(booking.startDate).format('YYYY-MM-DD HH:mm')}</td>
          <td>{moment(booking.endDate).format('YYYY-MM-DD HH:mm')}</td>
          <td>{booking.confirmed ? 'Confirmed' : 'Waiting to be confirmed'}</td>
          <td>{booking.deleteRequested ? 'Delete Requested' : 'No'}</td>
          <td><button onClick={() => this.saveBookingToStore(booking)}>View</button></td>
          <td>{!booking.deleteRequested && <button onClick={() => this.requestBookingToBeDeleted(booking._id)}>Request Delete</button>}</td>
        </tr>
      )
    })
  }

  render () {
    return (
      <div className='profile-container'>
        <h1 className='profile-title'>Profile</h1>
        <h2>Your Bookings</h2>
        <div className='profile'>
          <table className='profile-table'>
            <thead>
              <tr>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Confirmation Status</th>
                <th>Delete Requested</th>
              </tr>
            </thead>
            <tbody>
              {this.showUserBookings()}
            </tbody>
          </table>
        </div>
        {this.props.booking.fullName && <DetailsProfile />}
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    selectBooking: booking => dispatch(selectBooking(booking)),
    requestDelete: id => dispatch(requestDelete(id))
  }
}

function mapStateToProps (state) {
  return {
    booking: state.booking,
    bookings: state.bookings,
    authId: state.user.authId
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
