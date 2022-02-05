import Bookings from '../models/bookingModel.js'
import Cars from '../models/carModel.js'
import asyncHandler from 'express-async-handler'
const createBooking = asyncHandler(async (req, res) => {
  req.body.transactionId = '1234'
  const newbooking = new Bookings(req.body)
  await newbooking.save()
  const car = await Cars.findOne({ _id: req.body.car })
  car.bookedTimeSlots.push(req.body.bookedTimeSlots)

  await car.save()
  res.send('Your booking is successfull')
  
})

export { createBooking }