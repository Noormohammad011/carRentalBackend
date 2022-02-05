import asyncHandler from 'express-async-handler'
import ErrorResponse from '../utils/errorResponse.js'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

//@desc         Create user
//@route        Post /api/v1/bootcamps
//@access       Public

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body
  // validation
  if (!name) {
    return next(new ErrorResponse(`Name is required`, 400))
  }
  if (!password || password.length < 6) {
    return next(
      new ErrorResponse(
        `Password is required and should be min 6 characters long`,
        400
      )
    )
  }

  let userExist = await User.findOne({ email }).exec()
  if (userExist) {
    return next(new ErrorResponse(`Email is taken`, 400))
  }

  const user = await User.create({
    name,
    email,
    password,
  })
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    return next(new ErrorResponse(`Invalid user data`, 400))
  }
})

//@desc         Login user
//@route        Post /api/v1/bootcamps
//@access       Public

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token: generateToken(user._id),
    })
  } else {
    return next(new ErrorResponse('Invalid email or password', 401))
  }
})

export { registerUser, loginUser }
