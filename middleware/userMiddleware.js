import expressJwt from 'express-jwt'
import ErrorResponse from '../utils/errorResponse.js'
// req.user
export const protect = expressJwt({
  secret: 'nlajfldasfjlasdfasdfsdlfjlasjf',
  algorithms: ['HS256'],
})



export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    return next(new ErrorResponse('Not authorized as an admin', 401))
  }
}
