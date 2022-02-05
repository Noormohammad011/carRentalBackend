import express from 'express'
import { createCar, getCars, getCar } from '../controllers/carControllers.js'



const router = express.Router()

router.route('/').get(getCars).post(createCar)
router.route('/:id').get(getCar)

export default router
