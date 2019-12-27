const moment = require('moment')

process.env.OPENING_HOUR = 6
process.env.CLOSING_HOUR = 22

const validate = require('./validation')

const tomorrow = moment().add(1, 'day')

const exampleBooking = {
  fullName: 'Luke Warmwater',
  emailAddress: 'luke@luke.co.nz',
  phoneNumber: '1234567',
  startDate: moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 10]),
  endDate: moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 12]),
  purpose: 'To do things',
  guestNumber: 1
}

const exampleUser = {
  fullName: 'Jae Bird',
  emailAddress: 'jae@jae.jae',
  phoneNumber: '9876543'
}

const exampleBookings = [
  {
    startDate: moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 8]),
    endDate: moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 10])
  },
  {
    startDate: moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 12]),
    endDate: moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 16])
  }
]

test('data validation tests are return a string', () => {
  const type = typeof validate.validateBookingDetails(exampleBooking)
  expect(type).toBe('string')
})

test('check booking data validation returns "ok" when all booking data is valid', () => {
  const booking = Object.create(exampleBooking)
  const expected = 'ok'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('error message returned if name is missing from booking', () => {
  const booking = Object.create(exampleBooking)
  booking.fullName = ''
  const expected = "Please enter the contact person's name"
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('error message returned if phone number is missing from booking', () => {
  const booking = Object.create(exampleBooking)
  booking.phoneNumber = ''
  const expected = 'Please enter a valid phone number'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('error message returned if phone number does not contain numbers', () => {
  const booking = Object.create(exampleBooking)
  booking.phoneNumber = 'nine one one'
  const expected = 'Please enter a valid phone number'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('error message returned if phone number does not contain enough numbers', () => {
  const booking = Object.create(exampleBooking)
  booking.phoneNumber = '911'
  const expected = 'Please enter a valid phone number'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('validation passes if phone number is in format 01 234 5678', () => {
  const booking = Object.create(exampleBooking)
  booking.phoneNumber = '00 000 0000'
  const expected = 'ok'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('validation passes if phone number is in format 234 5678', () => {
  const booking = Object.create(exampleBooking)
  booking.phoneNumber = '000 0000'
  const expected = 'ok'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('validation passes if phone number is in format (01) 234 5678', () => {
  const booking = Object.create(exampleBooking)
  booking.phoneNumber = '(00) 000 0000'
  const expected = 'ok'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('validation passes if phone number is in format "01 234 4567 words"', () => {
  const booking = Object.create(exampleBooking)
  booking.phoneNumber = '078980894 but but please email instead'
  const expected = 'ok'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('validation passes if phone number is in format "021 123 4567"', () => {
  const booking = Object.create(exampleBooking)
  booking.phoneNumber = '0211111111'
  const expected = 'ok'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('error message returned if email address is missing from booking', () => {
  const booking = Object.create(exampleBooking)
  booking.emailAddress = ''
  const expected = 'string'
  const actual = typeof validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('error message returned if email address does not contain an "@" symbol', () => {
  const booking = Object.create(exampleBooking)
  booking.emailAddress = 'atgmaildotcom'
  const expected = 'Please enter a valid email address'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('error message returned if email address contains a space', () => {
  const booking = Object.create(exampleBooking)
  booking.emailAddress = 'my email is garfield@gmail.com'
  const expected = 'Please enter a valid email address'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('error message returned if purpose is missing from booking', () => {
  const booking = Object.create(exampleBooking)
  booking.purpose = ''
  const expected = 'Please enter the purpose for the booking'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('error message returned if start date is missing', () => {
  const booking = Object.create(exampleBooking)
  booking.startDate = null
  const expected = 'Please enter the starting date and time for the booking'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('error message returned if end date is missing', () => {
  const booking = Object.create(exampleBooking)
  booking.endDate = null
  const expected = 'Please enter the ending date and time for the booking'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('error message returned if start date is in the past', () => {
  const booking = Object.create(exampleBooking)
  booking.startDate = moment([1999, 1, 1, 11])
  const expected = 'You cannot use a start date/time in the past'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('error message returned if start date is after end date', () => {
  const booking = Object.create(exampleBooking)
  booking.startDate = moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 16])
  const expected = 'Please enter an end date/time that is after the start date/time'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('error message returned if start date not a round number of minutes', () => {
  const booking = Object.create(exampleBooking)
  booking.startDate = moment(booking.startDate).add(23, 'minutes')
  const expected = 'Please enter a start date/time that is either on the hour or on the half hour'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('error message returned if end date not a round number of minutes', () => {
  const booking = Object.create(exampleBooking)
  booking.endDate = moment(booking.startDate).add(23, 'seconds')
  const expected = 'Please enter an end date/time that is either on the hour or on the half hour'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('error message returned if end date equals start date', () => {
  const booking = Object.create(exampleBooking)
  booking.endDate = booking.startDate
  const expected = 'The minimum booking length is one hour'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('error message returned for 30 minute booking', () => {
  const booking = Object.create(exampleBooking)
  booking.endDate = moment(booking.startDate).add(30, 'minutes')
  const expected = 'The minimum booking length is one hour'
  const actual = validate.validateBookingDetails(booking)
  expect(actual).toBe(expected)
})

test('check user validation returns "ok" message for a valid user registration', () => {
  const user = Object.create(exampleUser)
  const expected = 'ok'
  const actual = validate.validateUserDetails(user)
  expect(actual).toBe(expected)
})

test('check user validation returns a string', () => {
  const user = {}
  const expected = 'string'
  const actual = typeof validate.validateUserDetails(user)
  expect(actual).toBe(expected)
})

test('error message returned if user did not enter a full name', () => {
  const user = Object.create(exampleUser)
  user.fullName = ''
  const expected = 'Please enter your full name'
  const actual = validate.validateUserDetails(user)
  expect(actual).toBe(expected)
})

test('error message returned if user did not enter an email address', () => {
  const user = Object.create(exampleUser)
  user.emailAddress = ''
  const expected = 'Please enter a contact email address'
  const actual = validate.validateUserDetails(user)
  expect(actual).toBe(expected)
})

test('error message returned if user did not enter a phone number', () => {
  const user = Object.create(exampleUser)
  user.phoneNumber = ''
  const expected = 'Please enter a contact phone number'
  const actual = validate.validateUserDetails(user)
  expect(actual).toBe(expected)
})

test('error message returned if user did not enter a valid email address', () => {
  const user = Object.create(exampleUser)
  user.emailAddress = 'asdf'
  const expected = 'Please enter a valid email address'
  const actual = validate.validateUserDetails(user)
  expect(actual).toBe(expected)
})

test('error message returned if user did not enter a valid phone number', () => {
  const user = Object.create(exampleUser)
  user.phoneNumber = '98y3'
  const expected = 'Please enter a valid phone number'
  const actual = validate.validateUserDetails(user)
  expect(actual).toBe(expected)
})

test('"ok" message returned if booking does not overlap with any other bookings', () => {
  const booking = Object.create(exampleBooking)
  booking.startDate = moment([tomorrow.year(), tomorrow.month(), tomorrow.date() + 1, 10])
  booking.endDate = moment([tomorrow.year(), tomorrow.month(), tomorrow.date() + 1, 12])
  const expected = 'ok'
  const actual = validate.checkBookingForOverlap(booking, exampleBookings)
  expect(actual).toBe(expected)
})

test("'ok' message returned if booking starts when another ends and otherwise does't overlap", () => {
  const booking = Object.create(exampleBooking)
  const expected = 'ok'
  const actual = validate.checkBookingForOverlap(booking, exampleBookings)
  expect(actual).toBe(expected)
})

test('message returned if booking starts when another booking starts', () => {
  const booking = Object.create(exampleBooking)
  booking.startDate = moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 12])
  booking.endDate = moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 14])
  const expected = 'Your request overlaps with another booking'
  const actual = validate.checkBookingForOverlap(booking, exampleBookings)
  expect(actual).toBe(expected)
})

test('message returned if booking overlaps the start date of another booking', () => {
  const booking = Object.create(exampleBooking)
  booking.startDate = moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 11])
  booking.endDate = moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 13])
  const expected = 'Your request overlaps with another booking'
  const actual = validate.checkBookingForOverlap(booking, exampleBookings)
  expect(actual).toBe(expected)
})

test('message returned if booking overlaps the end date of another booking', () => {
  const booking = Object.create(exampleBooking)
  booking.startDate = moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 14])
  booking.endDate = moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 21])
  const expected = 'Your request overlaps with another booking'
  const actual = validate.checkBookingForOverlap(booking, exampleBookings)
  expect(actual).toBe(expected)
})

test('message returned if booking overlaps all of another booking', () => {
  const booking = Object.create(exampleBooking)
  booking.startDate = moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 11])
  booking.endDate = moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 21])
  const expected = 'Your request overlaps with another booking'
  const actual = validate.checkBookingForOverlap(booking, exampleBookings)
  expect(actual).toBe(expected)
})

test('error message returned for a booking that starts before 6am', () => {
  const booking = Object.create(exampleBooking)
  booking.startDate = moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 2])
  const expected = 'You may not make a booking that starts that early'
  const actual = validate.validateAgainstOpenHours(booking)
  expect(actual).toBe(expected)
})

test('error message returned for a booking that starts after 10pm', () => {
  const booking = Object.create(exampleBooking)
  booking.startDate = moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 23])
  const expected = 'You may not make a booking that starts that late'
  const actual = validate.validateAgainstOpenHours(booking)
  expect(actual).toBe(expected)
})

test('error message returned for a booking that ends before 6am', () => {
  const booking = Object.create(exampleBooking)
  booking.endDate = moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 2])
  const expected = 'You may not make a booking that ends that early'
  const actual = validate.validateAgainstOpenHours(booking)
  expect(actual).toBe(expected)
})

test('error message returned for a booking that ends after 10pm', () => {
  const booking = Object.create(exampleBooking)
  booking.endDate = moment([tomorrow.year(), tomorrow.month(), tomorrow.date(), 23])
  const expected = 'You may not make a booking that ends that late'
  const actual = validate.validateAgainstOpenHours(booking)
  expect(actual).toBe(expected)
})

test('user is allowed to book over more than one day', () => {
  const booking = Object.create(exampleBooking)
  booking.endDate = moment([tomorrow.year(), tomorrow.month(), tomorrow.date() + 4, 16])
  const expected = 'ok'
  const actual = validate.validateAgainstOpenHours(booking)
  expect(actual).toBe(expected)
})
