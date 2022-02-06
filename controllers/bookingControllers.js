import Bookings from '../models/bookingModel.js'
import ErrorResponse from '../utils/errorResponse.js'
import Cars from '../models/carModel.js'
import asyncHandler from 'express-async-handler'
import Stripe from 'stripe'
import { v4 as uuidv4 } from 'uuid'
const stripe = Stripe(
  'sk_test_51K8gdwLv5rAyPDp0EkX3MKQC2NLSLQLkoLyGwD6m0XTPqvXY4vhQz1dH8CKqyd9Q3N3gvbiFurW7VCthruw3gPgW007YxLRO3B'
)

const createBooking = asyncHandler(async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      email: req.body.token.email,
      source: req.body.token.id,
    })

    const payment = await stripe.charges.create(
      {
        amount: req.body.totalAmount * 100,
        currency: 'USD',
        customer: customer.id,
        receipt_email: req.body.token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    )

    if (payment) {
      req.body.transactionId = payment.source.id
      const newbooking = new Bookings(req.body)
      await newbooking.save()
      const car = await Cars.findOne({ _id: req.body.car })

      car.bookedTimeSlots.push(req.body.bookedTimeSlots)

      await car.save()
      res.send('Your booking is successfull')
    } else {
      return res.status(400).json(error)
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json(error)
  }
})

const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Bookings.find()
  if (!bookings) {
    return next(new ErrorResponse(`Bookings not found`, 404))
  }
  res.status(200).json(bookings)
})

// @desc Delete a product
// @route DELETE /api/products/:id
// @access private/admin
const deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Bookings.findById(req.params.id)
  if (booking) {
    await booking.remove()
    res.json({ message: 'Booking is removed' })
  } else {
    return next(new ErrorResponse('Booking not found', 404))
  }
})

const singleBooking = asyncHandler(async (req, res, next) => {
  const booking = await Bookings.findById(req.params.id).exec()
  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json(booking)
})
export { createBooking, getAllBookings, deleteBooking, singleBooking }
