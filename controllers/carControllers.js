import asyncHandler from 'express-async-handler'
import ErrorResponse from '../utils/errorResponse.js'
import Cars from '../models/carModel.js'


const getCars = asyncHandler(async (req, res, next) => {
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

// @desc Create a product
// @route POST /api/products
// @access private/admin

const createCar = asyncHandler(async (req, res) => {

 const newcar = new Cars(req.body)
 await newcar.save()
 res.send('Car added successfully')

  
})

// @desc Delete a product
// @route DELETE /api/products/:id
// @access private/admin
const deleteCar = asyncHandler(async (req, res,next) => {
  const car = await Cars.findById(req.params.id)
  if (car) {
    await car.remove()
    res.json({ message: 'Car is removed' })
  } else {
     return next(new ErrorResponse('Car not found', 404))
  }
})



// @desc Update a product
// @route PUT /api/products/:id
// @access private/admin
const updateCar = asyncHandler(async (req, res, next) => {
  const car = await Cars.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
 if (!car) {
   return next(
     new ErrorResponse(`Car not found with id of ${req.params.id}`, 404)
   )
 }

  res.status(200).json(car)
})


export { getCars, getCar, createCar, deleteCar, updateCar }
