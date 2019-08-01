import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'

// TODO: figure out what the following comment
// means ... and if it's still valid

// bare min component to avoid err

function DetailsProfile (props) {
  const {
    fullName,
    emailAddress,
    phoneNumber,
    purpose,
    dateAdded
  } = props.booking

  // TODO: remove the <b> tags below; use styling instead
  return (
    <div className='details-profile-component'>
      <h2>Booking details</h2>
      <table className='detailsTableProfile'>
        <tr>
          <td><b>Request made for</b></td>
          <td>{fullName}</td>
        </tr>
        <tr>
          <td><b>Contact email</b></td>
          <td>{emailAddress}</td>
        </tr>
        <tr>
          <td><b>Contact number</b></td>
          <td>{phoneNumber}</td>
        </tr>
        <tr>
          <td><b>Purpose of event</b></td>
          <td>{purpose}</td>
        </tr>
        <tr>
          <td><b>Requested on</b></td>
          <td>{moment(dateAdded).format('YYYY-MM-DD HH:mm')}</td>
        </tr>
      </table>
    </div>
  )
}

function mapStateToProps ({ booking }) {
  return { booking }
}

export default connect(mapStateToProps)(DetailsProfile)
