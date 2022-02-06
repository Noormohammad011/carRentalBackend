import express from 'express'
import {
  registerUser,
  loginUser,
  getUsers,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userControllers.js'
import { admin, protect } from '../middleware/userMiddleware.js'

const router = express.Router()

router.route('/login').post(loginUser)
router.route('/register').post(registerUser).get(protect, admin, getUsers)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)

export default router
