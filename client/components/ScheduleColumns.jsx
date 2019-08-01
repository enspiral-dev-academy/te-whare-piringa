import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'

import ScheduleColumn from './ScheduleColumn'

function ScheduleColumns (props) {
  return (
    <div className='schedule-columns' >
      <ScheduleColumn
        dayClass='yesterday'
        date={moment(props.date).subtract(1, 'days')} />

      <ScheduleColumn
        dayClass='today'
        date={moment(props.date)} />

      <ScheduleColumn
        dayClass='tomorrow'
        date={moment(props.date).add(1, 'days')} />
    </div>
  )
}

function mapStateToProps ({ date }) {
  return { date }
}

export default connect(mapStateToProps)(ScheduleColumns)
