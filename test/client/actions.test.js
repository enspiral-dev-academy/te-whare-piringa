import { makeNewBooking } from '../../client/actions/calendar'

test('create actions for adding a new booking', () => {
  const dateStart = 1497844905633
  const dateEnd = 1497844905633
  const expected = {
    type: 'NEW_BOOKING',
    dateStart,
    dateEnd
  }
  const actual = makeNewBooking(dateStart, dateEnd)
  expect(actual).toEqual(expected)
})
