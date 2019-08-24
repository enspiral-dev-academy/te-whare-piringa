import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Route, Link } from 'react-router-dom'

import {
  selectBooking,
  deselectBooking,
  deleteBooking } from '../actions/bookings'
import DetailsProfile from './DetailsProfile'

class Profile extends React.Component {
  showUserBookings () {
    return this.props.bookings
      .filter(booking => booking.emailAddress)
      .map(booking => (
        <tr key={booking._id}>
          <td>
            <Link to={`/profile/details/${booking._id}`}
              replace={true}>{booking.purpose}</Link>
          </td>
          <td>{moment(booking.startDate).format('YYYY-MM-DD HH:mm')}</td>
          <td>{booking.confirmed ? 'Yes' : 'No'}</td>
        </tr>
      ))
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
                <th>Purpose</th>
                <th>Start Time</th>
                <th>Confirmed</th>
              </tr>
            </thead>
            <tbody>
              {this.showUserBookings()}
            </tbody>
          </table>
        </div>
        <Route path='/profile/details/:id' component={DetailsProfile} />
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    selectBooking: booking => dispatch(selectBooking(booking)),
    deleteBooking: booking => {
      dispatch(deleteBooking(booking))
      dispatch(deselectBooking(booking))
    }
  }
}

function mapStateToProps ({ user, booking, bookings }) {
  return { user, booking, bookings }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
