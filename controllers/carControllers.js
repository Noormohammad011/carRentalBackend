import asyncHandler from 'express-async-handler'

import Cars from '../models/carModel.js'


const getCars = asyncHandler(async (req, res, next) => {
  const cars = await Cars.find()
  if (!cars) {
    res.status(404)
    throw new Error('Cars not found')
   
  }
  res.status(200).json(cars)
})

const getCar = asyncHandler(async (req, res, next) => {
  const car = await Cars.findById(req.params.id)

  if (!car) {
    res.status(404)
    throw new Error('Cars not found')
  }
  res.status(200).json(car)
})

// @desc Create a product
// @route POST /api/products
// @access private/admin

const createCar = asyncHandler(async (req, res) => {

 const newcar = new Cars(req.body)
 await newcar.save()
 res.status(200).json(newcar)

  
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
    res.status(404)
    throw new Error('Cars not found')
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
  res.status(404)
  throw new Error('Cars not found')
 }

  res.status(200).json(car)
})


export { getCars, getCar, createCar, deleteCar, updateCar }
