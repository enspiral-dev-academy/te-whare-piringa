import React from 'react'
import Modal from 'react-modal'
import { connect } from 'react-redux'

import {
  confirmBooking,
  deleteBooking,
  selectBooking
} from '../actions/bookings'
import Details from './Details'
import Setting from './Settings'

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

class Admin extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showSettings: false,
      currentFilter: 'unconfirmed',
      modal: false,
      sure: false
    }

    this.handleConfirmClick = this.handleConfirmClick.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
    this.saveBookingToStore = this.saveBookingToStore.bind(this)
    this.settingShow = this.settingShow.bind(this)
    this.applyFilter = this.applyFilter.bind(this)
    this.isInFilter = this.isInFilter.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  settingShow () {
    this.setState({
      showSettings: !this.state.showSettings
    })
  }

  handleConfirmClick (id) {
    this.props.dispatch(confirmBooking(id))
    this.setState({
      modal: false
    })
  }

  handleDeleteClick (booking) {
    this.props.dispatch(deleteBooking(booking))
    this.setState({
      modal: false,
      sure: false
    })
  }

  saveBookingToStore (booking) {
    this.props.dispatch(selectBooking(booking))
    this.setState({
      modal: true
    })
  }

  handleClose () {
    this.setState({
      modal: false,
      showSettings: false,
      sure: false
    })
    this.props.history.replace('/admin')
  }

  applyFilter (currentFilter) {
    this.setState({
      currentFilter
    })
  }

  isInFilter (booking) {
    const endDateIsInFuture = booking.endDate > new Date()
    const current = this.state.currentFilter
    if (current === 'unconfirmed' && !booking.confirmed && endDateIsInFuture) {
      return true
    }
    if (current === 'confirmed' && booking.confirmed && endDateIsInFuture) {
      return true
    }
    if (current === 'delete' && booking.deleteRequested && endDateIsInFuture) {
      return true
    }
    if (current === 'all' && endDateIsInFuture) {
      return true
    }
    if (current === 'history' && !endDateIsInFuture) {
      return true
    }
    return false
  }

  requestBookingToBeDeleted (booking) {
    this.props.requestDelete(booking)
    this.handleClose()
  }

  render () {
    const isAdmin = this.props.user && this.props.user.isAdmin
    return (
      <div className="admin-portal container">
        <div>
          <h2>Hey Admin</h2>
          <div className="row">
            <div className="col-md-1" />
            <div className="col-md-10">
              <h2>Bookings</h2>
              <div>
                <div className="admin-radio-container">
                  <div>
                    <input type="radio" name="filter" id="Show All" onClick={() => this.applyFilter('all') } />
                    &nbsp;
                    <label htmlFor="Show All">All</label>
                    &nbsp;&nbsp;&nbsp;
                  </div>
                  <div>
                    <input type="radio" name="filter" id="Show Unconfirmed" onClick={() => this.applyFilter('unconfirmed')} defaultChecked/>
                    &nbsp;
                    <label htmlFor="Show Unconfirmed">Unconfirmed</label>
                    &nbsp;&nbsp;&nbsp;
                  </div>
                  <div>
                    <input type="radio" name="filter" id="Show Confirmed" onClick={() => this.applyFilter('confirmed')} />
                    &nbsp;
                    <label htmlFor="Show Confirmed">Confirmed</label>
                    &nbsp;&nbsp;&nbsp;
                  </div>
                  <div>
                    <input type="radio" name="filter" id="Show Delete Requested" onClick={() => this.applyFilter('delete')} />
                    &nbsp;
                    <label htmlFor="Show Delete Requested">Delete Requested</label>
                    &nbsp;&nbsp;&nbsp;
                  </div>
                  <div>
                    <input type="radio" name="filter" id="Show History" onClick={() => this.applyFilter('history')} />
                    &nbsp;
                    <label htmlFor="Show History">History</label>
                    &nbsp;
                  </div>
                </div>
              </div>
              <div className="unconfirmed-list">
                {this.props.bookings.filter(this.isInFilter).map(item => {
                  return (
                    <div key={item._id} className="row">
                      <div className="col-sm-12">
                        <div className="list-of-unconfirmed" onClick={() => { this.saveBookingToStore(item) }}>
                          {item.fullName}<hr />
                          {item.startDate.toString().substring(0, 16)} to {item.endDate.toString().substring(0, 16)}<hr />
                          {item.startDate.toString().substring(16, 21)} to {item.endDate.toString().substring(16, 21)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-1" />
            <div className="col-md-10 text-center">
              {isAdmin && (
                <div>
                  <button onClick={this.settingShow} className="setting-btn">Settings</button>
                  {this.state.showSettings &&
                    <Modal
                      style={modalStyle}
                      isOpen={this.state.showSettings}
                      onRequestClose={this.handleClose}>
                      <Setting close={this.handleClose}/>
                    </Modal>
                  }
                </div>
              )}
              {this.props.booking.fullName && this.state.modal &&
                <Modal isOpen={this.state.modal} onRequestClose={this.handleClose} style={modalStyle}>
                  <div>
                    <h3>Details</h3>
                    <Details />
                    {!isAdmin && !this.state.sure && <div className="text-center"> <button onClick={() => this.setState({ sure: true })}>Request Delete</button></div>}
                    {!isAdmin && this.state.sure &&
                      <div className="text-center">
                        <p className="sure">Are you sure?</p>
                        <button onClick={() => this.requestBookingToBeDeleted(this.props.booking)}>Yes, Request Delete</button>
                      </div>
                    }
                    {isAdmin &&
                      <div className="modal-admin">
                        {!this.state.sure &&
                          <div className="text-center">
                            {!this.props.booking.confirmed && <span className="glyphicon glyphicon-ok confirm" onClick={() => { this.handleConfirmClick(this.props.booking._id) }}></span>}
                            <span className="glyphicon glyphicon-trash remove" onClick={() => this.setState({ sure: true })}></span>
                          </div>
                        }
                        {this.state.sure &&
                          <div className="text-center">
                            <p className='sure'>Are you sure you want to delete?</p>
                            <button className="setting-button" onClick={() => { this.handleDeleteClick(this.props.booking) }}>Yes</button>
                            <button className="setting-button" onClick={this.handleClose} defaultValue>No</button>
                          </div>
                        }
                      </div>
                    }
                  </div>
                </Modal>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    booking: state.booking,
    bookings: state.bookings,
    user: state.user && state.user.details
  }
}

export default connect(mapStateToProps)(Admin)
