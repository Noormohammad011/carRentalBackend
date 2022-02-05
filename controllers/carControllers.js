import asyncHandler from 'express-async-handler'
import ErrorResponse from '../utils/errorResponse.js'
import Cars from '../models/carModel.js'

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getCars = asyncHandler(async (req, res) => {
  const cars = await Cars.find()
  if (!cars) {
    return next(new ErrorResponse(`Cars not found`, 404))
  }
  res.status(200).json(cars)
})

const getCar = asyncHandler(async (req, res, next) => {
  const car = await Cars.findById(req.params.id)

  if (!car) {
    return next(
      new ErrorResponse(`car not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json(car)
})

const createCar = asyncHandler(async (req, res) => {
  const car = await Cars.create(req.body)

  res.status(201).json({
    success: true,
    data: car,
  })
})

export { getCars, getCar, createCar }
