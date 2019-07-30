import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'

import { switchDate, setNewBooking } from '../actions/calendar'
import { numberOfIntervals } from '../utils/overlap'

class Calendar extends React.Component {
  constructor (props) {
    super(props)
    this.previousMonth = this.previousMonth.bind(this)
    this.nextMonth = this.nextMonth.bind(this)
    this.selectDate = this.selectDate.bind(this)
  }

  componentDidMount () {
    if (window.localStorage.getItem('date')) {
      this.props.switchDate(new Date(window.localStorage.getItem('date')))
      this.props.setNewBooking(new Date(window.localStorage.getItem('startTime')), new Date(window.localStorage.getItem('endTime')))
      window.localStorage.removeItem('startTime')
      window.localStorage.removeItem('endTime')
      window.localStorage.removeItem('date')
      this.props.history.push('/schedule')
    }
  }

  previousMonth () {
    const d = this.props.date
    const newD = new Date(moment(d).subtract(1, 'months'))
    this.props.switchDate(newD)
  }

  nextMonth () {
    const d = this.props.date
    const newD = new Date(moment(d).add(1, 'months'))
    this.props.switchDate(newD)
  }

  selectDate (e) {
    const dateString = e.target.id.substr(3)
    const dateSelected = new Date(moment(dateString, 'YYYY-MM-DD'))
    if (!this.props.admin && dateSelected < new Date().setHours(0, 0, 0, 0)) return
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
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).getDay()
    const lastDate = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
    const lastDay = new Date(d.getFullYear(), d.getMonth(), lastDate).getDay()

    const dateArray = []
    let today = new Date()
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    const adminStyle = {}
    adminStyle.cursor = this.props.admin ? 'pointer' : null

    let i = 0
    while (i < firstDay) {
      const thisDate = new Date(d.getFullYear(), d.getMonth(), 1 - firstDay + i)
      const thisDateFormatted = moment(thisDate).format('YYYY-MM-DD')
      let classNames = 'calendar-date last-month'

      if (thisDate.getTime() > today.getTime()) {
        classNames += ' future'
      }

      dateArray.push(<div
        key={thisDateFormatted}
        id={'day' + thisDateFormatted}
        className={classNames}
        onClick={this.selectDate}
        style={adminStyle}> {thisDate.getDate()} </div>
      )
      i++
    }

    i = 1
    while (i <= lastDate) {
      const thisDate = new Date(d.getFullYear(), d.getMonth(), i)
      const thisDateFormatted = moment(thisDate).format('YYYY-MM-DD')
      let classNames = 'calendar-date this-month'

      if (thisDate.getTime() === today.getTime()) {
        classNames += ' currentDay'
      }

      if (thisDate.getTime() < today.getTime()) {
        classNames += ' calendar-inactive'
      }

      if (thisDate.getTime() >= today.getTime()) {
        const thisBusy = howBusyIsIt(thisDate.getTime(), bookings)
        classNames += [' calendar-orange', +thisBusy].join('')
      }

      dateArray.push(<div
        key={thisDateFormatted}
        id={'day' + thisDateFormatted}
        className={classNames}
        onClick={this.selectDate}
        style={adminStyle}> {thisDate.getDate()} </div>
      )
      i++
    }

    i = 1
    while (i < 7 - lastDay) {
      const thisDate = new Date(d.getFullYear(), d.getMonth() + 1, i)
      const thisDateFormatted = moment(thisDate).format('YYYY-MM-DD')
      let classNames = 'calendar-date next-month'

      if (thisDate.getTime() < today.getTime()) {
        classNames += ' calendar-inactive'
      }

      if (thisDate.getTime() >= today.getTime()) {
        const thisBusy = howBusyIsIt(thisDate.getTime(), bookings)
        classNames += [' calendar-orange', +thisBusy].join('')
      }

      dateArray.push(<div
        key={thisDateFormatted}
        id={'day' + thisDateFormatted}
        className={classNames}
        onClick={this.selectDate}> {thisDate.getDate()} </div>
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
    date: state.display.date,
    bookings: state.bookings,
    admin: state.user.admin
  }
}

function mapDispatchToProps (dispatch) {
  return {
    switchDate: date => dispatch(switchDate(date)),
    setNewBooking: (start, end) => dispatch(setNewBooking(start, end))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar)
