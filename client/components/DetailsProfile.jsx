import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { deleteBooking } from '../actions/bookings'

function DetailsProfile (props) {
  const { id } = props.match.params
  const booking = props.bookings.find(booking => booking._id === id)

  if (!booking) {
    return (
      <div className='details-profile-component'>
        <h2>Booking details</h2>
        <div>Unable to find booking with id {id}</div>
      </div>
    )
  }

  const {
    fullName,
    emailAddress,
    phoneNumber,
    purpose,
    confirmed,
    deleteRequested,
    startDate = moment(),
    endDate = moment(),
    dateAdded = moment()
  } = booking

  // TODO: remove the <b> tags below; use styling instead
  return (
    <div className='details-profile-component'>
      <h2>Booking details</h2>
      <table className='detailsTableProfile'>
        <tbody>
          <tr>
            <td><b>Requestor</b></td>
            <td>{fullName}</td>
          </tr>
          <tr>
            <td><b>Email address</b></td>
            <td>{emailAddress}</td>
          </tr>
          <tr>
            <td><b>Phone number</b></td>
            <td>{phoneNumber}</td>
          </tr>
          <tr>
            <td><b>Purpose of event</b></td>
            <td>{purpose}</td>
          </tr>
          <tr>
            <td><b>Start date/time</b></td>
            <td>{startDate.format('YYYY-MM-DD HH:mm')}</td>
          </tr>
          <tr>
            <td><b>End date/time</b></td>
            <td>{endDate.format('YYYY-MM-DD HH:mm')}</td>
          </tr>
          <tr>
            <td><b>Confirmed</b></td>
            <td>{confirmed ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td><b>Delete requested</b></td>
            <td>{deleteRequested ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td><b>Requested on</b></td>
            <td>{dateAdded.format('YYYY-MM-DD HH:mm')}</td>
          </tr>
        </tbody>
      </table>
      {!deleteRequested &&
        <button onClick={() => props.dispatch(deleteBooking(booking))}>
          Request this booking be deleted
        </button>
      }
      <p><Link to='/profile'>Hide booking details</Link></p>
    </div>
  )
}

function mapStateToProps ({ bookings }) {
  return { bookings }
}

export default connect(mapStateToProps)(DetailsProfile)
