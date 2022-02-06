import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import ErrorResponse from '../utils/errorResponse.js'
import User from '../models/userModel.js'
// req.user
export const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, 'nlajfldasfjlasdfasdfsdlfjlasjf')

      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      return next(new ErrorResponse('Not authorized, token failed', 401))
    }
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized, no token', 401))
  }
})

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    return next(new ErrorResponse('Not authorized as an admin', 401))
  }
}
