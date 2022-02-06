import express from 'express'
import { createBooking, deleteBooking, getAllBookings, singleBooking } from '../controllers/bookingControllers.js'
import { admin, protect } from '../middleware/userMiddleware.js'

const router = express.Router()

router.route('/bookcar').post(createBooking).get(protect, admin, getAllBookings)
router
  .route('/:id')
  .delete(protect, admin, deleteBooking)
  .get(singleBooking, protect)


export default router
