import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'

// TODO: figure out what the following comment
// means ... and if it's still valid

// bare min component to avoid err

function Details (props) {
  const {
    fullName,
    emailAddress,
    phoneNumber,
    purpose,
    dateAdded,
    confirmed,
    deleteRequested
  } = props.booking

  // TODO: remove the <b> tags below; use styling instead
  return (
    <div>
      <table className='detailsTable'>
        <tbody>
          <tr>
            <td><b>Name</b></td>
            <td>{fullName}</td>
          </tr>
          <tr>
            <td><b>Email</b></td>
            <td>{emailAddress}</td>
          </tr>
          <tr>
            <td><b>Phone</b></td>
            <td>{phoneNumber}</td>
          </tr>
          <tr>
            <td><b>Purpose</b></td>
            <td>{purpose}</td>
          </tr>
          <tr>
            <td><b>Requested on</b></td>
            <td>{moment(dateAdded).format('YYYY-MM-DD HH:mm')}</td>
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
  )
}

function mapStateToProps (state) {
  return {
    booking: state.booking
  }
}

export default connect(mapStateToProps)(Details)
