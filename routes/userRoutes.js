import express from 'express'
import { registerUser, loginUser } from '../controllers/userControllers.js'


const router = express.Router()

router.route('/login').post(loginUser)
router.route('/register').post(registerUser)

export default router
