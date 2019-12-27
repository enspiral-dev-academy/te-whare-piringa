const moment = require('moment')

const { openingHour, closingHour } = require('./config')

module.exports = {
  validateBookingDetails,
  validateUserDetails,
  checkBookingForOverlap,
  validateAgainstOpenHours
}

function validateBookingDetails (booking) {
  const { startDate, endDate, purpose, fullName, emailAddress, phoneNumber } = booking

  if (!booking) return 'No booking details found'
  if (!purpose) return 'Please enter the purpose for the booking'
  if (!startDate) return 'Please enter the starting date and time for the booking'
  if (!endDate) return 'Please enter the ending date and time for the booking'
  if (!fullName) return "Please enter the contact person's name"

  if (!checkEmailFormat(emailAddress)) return 'Please enter a valid email address'
  if (!checkPhoneNumber(phoneNumber)) return 'Please enter a valid phone number'

  if (!startDate.isValid()) {
    return 'Please ensure the start date/time is in the correct format'
  }
  if (!endDate.isValid()) {
    return 'Please ensure the end date/time is in the correct format'
  }

  if (moment().isAfter(startDate)) {
    return 'You cannot use a start date/time in the past'
  }
  if (startDate.isAfter(endDate)) {
    return 'Please enter an end date/time that is after the start date/time'
  }

  if (!hasBeenRounded(startDate)) {
    return 'Please enter a start date/time that is either on the hour or on the half hour'
  }
  if (!hasBeenRounded(endDate)) {
    return 'Please enter an end date/time that is either on the hour or on the half hour'
  }

  if (endDate.isBefore(moment(startDate).add(1, 'hours'))) {
    return 'The minimum booking length is one hour'
  }

  return 'ok'
}

function hasBeenRounded (date) {
  const minutes = date.minutes()
  return (minutes === 0 || minutes === 30) &&
    date.seconds() === 0 && date.milliseconds() === 0
}

function validateAgainstOpenHours (booking) {
  const { startDate, endDate } = booking

  if (startDate.hours() + startDate.minutes() / 60 < openingHour) {
    return 'You may not make a booking that starts that early'
  }

  if (startDate.hours() + startDate.minutes() / 60 >= closingHour) {
    return 'You may not make a booking that starts that late'
  }

  if (endDate.hours() + endDate.minutes() / 60 <= openingHour) {
    return 'You may not make a booking that ends that early'
  }

  if (endDate.hours() + endDate.minutes() / 60 > closingHour) {
    return 'You may not make a booking that ends that late'
  }

  return 'ok'
}

function validateUserDetails (user) {
  if (!user) return 'No booking details found'
  if (!user.fullName) return 'Please enter your full name'
  if (!user.emailAddress) return 'Please enter a contact email address'
  if (!user.phoneNumber) return 'Please enter a contact phone number'
  if (!checkEmailFormat(user.emailAddress)) return 'Please enter a valid email address'
  if (!checkPhoneNumber(user.phoneNumber)) return 'Please enter a valid phone number'
  return 'ok'
}

function checkPhoneNumber (phoneNumber) {
  return phoneNumber.replace(/[^0-9]/g, '').length > 6
}

function checkEmailFormat (email) {
  const pattern = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/
  return pattern.test(email)
}

function checkBookingForOverlap (booking, bookings) {
  bookings = bookings.filter(booking => !booking.deleteRequested)
  const startDate1 = moment(booking.startDate)
  const endDate1 = moment(booking.endDate)
  if (bookings.find(compareHours)) return 'Your request overlaps with another booking'
  return 'ok'

  function compareHours (existingBooking) {
    const startDate2 = moment(existingBooking.startDate)
    const endDate2 = moment(existingBooking.endDate)
    return (endDate1 > startDate2 && (startDate1 < startDate2 || endDate1 <= endDate2)) || (startDate1 < endDate2 && (endDate1 > endDate2 || startDate1 >= startDate2))
  }
}
