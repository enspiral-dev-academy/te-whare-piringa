import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { switchDate } from '../actions/bookings'
import { numberOfIntervals } from '../utils/overlap'

class Calendar extends React.Component {
  constructor (props) {
    super(props)
    this.previousMonth = this.previousMonth.bind(this)
    this.nextMonth = this.nextMonth.bind(this)
    this.selectDate = this.selectDate.bind(this)
  }

  componentDidMount () {
    // if (window.localStorage.getItem('date')) {
    //   this.props.switchDate(new Date(window.localStorage.getItem('date')))
    //   this.props.setNewBooking(new Date(window.localStorage.getItem('startTime')), new Date(window.localStorage.getItem('endTime')))
    //   window.localStorage.removeItem('startTime')
    //   window.localStorage.removeItem('endTime')
    //   window.localStorage.removeItem('date')
    //   this.props.history.push('/schedule')
    // }
  }

  previousMonth () {
    const previous = moment(this.props.date).subtract(1, 'months')
    this.props.switchDate(previous)
  }

  nextMonth () {
    const next = moment(this.props.date).add(1, 'months')
    this.props.switchDate(next)
  }

  selectDate (e) {
    const dateString = e.target.id.substr(3)
    const dateSelected = moment(dateString, 'YYYY-MM-DD')
    if (!this.props.admin && moment().isAfter(dateSelected, 'day')) return
    this.props.switchDate(dateSelected)
    this.props.history.push('/schedule')
  }

  render () {
    return (
      <div className='calendar container'>
        <div className='calendar-title'>
          <h2>
            <span className='calendar-previous'>
              <a onClick={this.previousMonth} >
                <img className='calendar-arrows calendar-arrow-left'
                  src='/images/left.png' />
              </a>
            </span>
            {moment(this.props.date).format('MMMM YYYY')}
            <span className='calendar-next'>
              <a onClick={this.nextMonth}>
                <img className='calendar-arrows calendar-arrow-right'
                  src='/images/right-arrow-icon.png' />
              </a>
            </span>
          </h2>
        </div>
        <div className='busy-indicator'>
          <p>Free</p><div className='calendar-busy-bar'></div><p>Booked out</p>
        </div>
        <div className="calendar-container">
          <div className='calendar-header-container'>
            <div className='calendar-header'>Sunday</div>
            <div className='calendar-header'>Monday</div>
            <div className='calendar-header'>Tuesday</div>
            <div className='calendar-header'>Wednesday</div>
            <div className='calendar-header'>Thursday</div>
            <div className='calendar-header'>Friday</div>
            <div className='calendar-header'>Saturday</div>
          </div>
          <div className='calendar-date-container'>
            {this.getDates(this.props.date, this.props.bookings)}
          </div>
        </div>
      </div>
    )
  }

  getDates (d, bookings) {
    const date = moment([d.year(), d.month()])
    const firstDay = moment(date).date(1).day()
    const lastDate = moment(date).endOf('month').date()
    const lastDay = moment([d.year(), d.month(), lastDate]).day()

    let today = moment()
    today = moment([today.year(), today.month(), today.date()])

    const dateArray = []
    const adminStyle = {}
    adminStyle.cursor = this.props.admin ? 'pointer' : null

    // previous month
    let i = 0
    while (i < firstDay) {
      const thisDate = moment(date).day(firstDay - 1)
      const thisDateFormatted = thisDate.format('YYYY-MM-DD')
      const classNames = ['calendar-date', 'last-month']

      if (thisDate.isAfter(today)) {
        classNames.push('future')
      }

      dateArray.push(<div
        key={thisDateFormatted}
        id={'day' + thisDateFormatted}
        className={classNames.join(' ')}
        onClick={this.selectDate}
        style={adminStyle}>{thisDate.date()}</div>
      )
      i++
    }

    // current month
    i = 1
    while (i <= lastDate) {
      const thisDate = moment([d.year(), d.month(), i])
      const thisDateFormatted = thisDate.format('YYYY-MM-DD')
      const classNames = ['calendar-date', 'this-month']

      if (thisDate.isSame(today, 'day')) {
        classNames.push('currentDay')
      }

      if (thisDate.isBefore(today)) {
        classNames.push('calendar-inactive')
      }

      if (thisDate.isSameOrAfter(today)) {
        const thisBusy = howBusyIsIt(thisDate, bookings)
        classNames.push('calendar-orange')
        classNames.push(thisBusy)
      }

      dateArray.push(<div
        key={thisDateFormatted}
        id={'day' + thisDateFormatted}
        className={classNames.join(' ')}
        onClick={this.selectDate}
        style={adminStyle}>{thisDate.date()}</div>
      )
      i++
    }

    // next month
    i = 1
    while (i < 7 - lastDay) {
      const thisDate = moment([d.year(), d.month()]).add('months', 1).date(i)
      const thisDateFormatted = thisDate.format('YYYY-MM-DD')
      let classNames = ['calendar-date', 'next-month']

      if (thisDate.isBefore(today)) {
        classNames.push('calendar-inactive')
      }

      if (thisDate.isSameOrAfter(today)) {
        const thisBusy = howBusyIsIt(thisDate, bookings)
        classNames.push('calendar-orange')
        classNames.push(thisBusy)
      }

      dateArray.push(<div
        key={thisDateFormatted}
        id={'day' + thisDateFormatted}
        className={classNames.join(' ')}
        onClick={this.selectDate}>{thisDate.date()}</div>
      )
      i++
    }

    return dateArray
  }
}

function howBusyIsIt (date, bookings) {
  // TODO: remove comments of earlier implementation below
  // let hoursUnavailable = 0
  // for (let i = 0; i < bookings.length; i++) {
  //   if (moment(bookings[i].startDate).isSame(date, 'day')) {
  //     hoursUnavailable += numberOfIntervals(bookings[i].startDate, bookings[i].endDate)
  //   }
  // }
  // return hoursUnavailable
  return bookings.reduce(
    (acc, { startDate, endDate }) => {
      return startDate.isSame(date, 'day')
        ? acc + numberOfIntervals(startDate, endDate)
        : acc
    }, 0
  )
}

function mapStateToProps (state) {
  return {
    date: state.date,
    bookings: state.bookings,
    isAdmin: state.user.details && state.user.details.isAdmin
  }
}

function mapDispatchToProps (dispatch) {
  return {
    switchDate: date => dispatch(switchDate(date))
    // setNewBooking: (start, end) => dispatch(setNewBooking(start, end))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Calendar))
