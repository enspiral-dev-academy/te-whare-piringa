import React from 'react'
import moment from 'moment'

// TODO: apply configuration
// import {
//   openingHour,
//   closingHour,
//   minimumLength,
//   increment
// } from '../../shared/config'

export default function HoursColumn (props) {
  return (
    <div className='schedule-hours-container'>
      {getHours()}
    </div>
  )
}

function getHours () {
  const hourArray = []
  const date = moment()
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 2; j++) {
      const classNames = ['hour']
      const selectedDate = date.hour(i + 6).minute(j * 30)
      const dateFormatted = moment(selectedDate).format('HH:mm')
      const divContents = j === 1 ? dateFormatted : ''
      classNames.push(j === 1 ? 'half-hour' : 'full-hour')

      hourArray.push(
        <div key={dateFormatted} className={classNames.join(' ')}>
          {divContents}
        </div>
      )
    }
  }
  return hourArray
}
