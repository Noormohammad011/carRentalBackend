import express from 'express'
import { createCar, getCars, getCar, deleteCar, updateCar } from '../controllers/carControllers.js'
import { admin, protect } from '../middleware/userMiddleware.js'



const router = express.Router()

router.route('/').get(getCars).post(protect, admin, createCar)
router
  .route('/:id')
  .get(getCar)
  .delete(protect, admin, deleteCar)
  .put(protect, admin, updateCar)

export default router

