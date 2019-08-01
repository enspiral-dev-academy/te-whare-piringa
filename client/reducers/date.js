import moment from 'moment'

import { SWITCH_DATE } from '../actions/bookings'

const initialDate = moment().hours(0).minutes(0).seconds(0).milliseconds(0)

export default function (date = initialDate, action) {
  switch (action.type) {
    case SWITCH_DATE:
      return action.date

    default:
      return date
  }
}
