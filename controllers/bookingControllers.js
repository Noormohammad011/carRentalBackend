import Bookings from '../models/bookingModel.js'
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

export { createBooking }