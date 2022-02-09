import express from 'express'
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  singleBooking,
  updateBooking,
} from '../controllers/bookingControllers.js'
import { admin, protect } from '../middleware/userMiddleware.js'

const router = express.Router()

router.route('/bookcar').post(createBooking).get(protect, getAllBookings)
router
  .route('/:id')
  .delete(protect, admin, deleteBooking)
  .get(protect, admin, singleBooking)
  .put(protect, admin, updateBooking)


export default router
