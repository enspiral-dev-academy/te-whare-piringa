import moment from 'moment'
import { ObjectId } from 'mongodb'

import {
  sendBookingRequest,
  sendBookingConfirmation,
  sendDeletionRequest,
  sendDeletionConfirmation
} from './email'

import { newRequestEmail } from '../shared/config'

const tomorrow = moment().add(1, 'days')

const booking = {
  _id: ObjectId('5d0c3b12ea60fc0ae2185eac'),
  fullName: 'Test User',
  phoneNumber: '123456789',
  emailAddress: 'testuser@tewharepiringa.nz',
  startDate: tomorrow.hour(9),
  endDate: tomorrow.hour(17),
  purpose: 'For testing purposes',
  guestCount: 30,
  confirmed: false,
  deleteRequested: false
}

describe('new booking request', () => {
  it('sends a properly configured booking request email', () => {
    const sendMail = jest.fn()
    sendBookingRequest(booking, sendMail)
    const email = sendMail.mock.calls[0][0]

    expect(sendMail).toBeCalled()
    expect(email.to).toBe(newRequestEmail)
    expect(email.from).toBe(booking.emailAddress)
    expect(email.subject).toMatch('New booking')
    expect(email.html).toMatch(booking.emailAddress)
    expect(email.html).toMatch(booking.phoneNumber)
    expect(email.html).toMatch(booking.purpose)
    expect(email.html).toMatch(booking.guestCount.toString())
  })
})

describe('booking confirmation', () => {
  it('sends a booking confirmation email', () => {
    const sendMail = jest.fn()
    sendBookingConfirmation(booking, sendMail)
    const email = sendMail.mock.calls[0][0]

    expect(sendMail).toBeCalled()
    expect(email.from).toBe(newRequestEmail)
    expect(email.to).toBe(booking.emailAddress)
    expect(email.subject).toMatch('Booking confirmation')
    expect(email.html).toMatch(booking.emailAddress)
    expect(email.html).toMatch(booking.phoneNumber)
    expect(email.html).toMatch(booking.purpose)
    expect(email.html).toMatch(booking.guestCount.toString())
  })
})

describe('delete booking request', () => {
  it('sends a deletion request for a booking', () => {
    const sendMail = jest.fn()
    sendDeletionRequest(booking, sendMail)
    const email = sendMail.mock.calls[0][0]

    expect(sendMail).toBeCalled()
    expect(email.to).toBe(newRequestEmail)
    expect(email.from).toBe(booking.emailAddress)
    expect(email.subject).toMatch('Request to delete')
    expect(email.html).toMatch(booking.emailAddress)
    expect(email.html).toMatch(booking.phoneNumber)
    expect(email.html).toMatch(booking.purpose)
    expect(email.html).toMatch(booking.guestCount.toString())
  })
})

describe('deletion confirmation', () => {
  it('sends a booking deletion confirmation email', () => {
    const sendMail = jest.fn()
    sendDeletionConfirmation(booking, sendMail)
    const email = sendMail.mock.calls[0][0]

    expect(sendMail).toBeCalled()
    expect(email.from).toBe(newRequestEmail)
    expect(email.to).toBe(booking.emailAddress)
    expect(email.subject).toMatch('Booking deleted')
    expect(email.html).toMatch(booking.emailAddress)
    expect(email.html).toMatch(booking.phoneNumber)
    expect(email.html).toMatch(booking.purpose)
    expect(email.html).toMatch(booking.guestCount.toString())
  })
})
