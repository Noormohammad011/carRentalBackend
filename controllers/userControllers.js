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
      isAdmin: user.isAdmin,
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
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token: generateToken(user._id),
    })
  } else {
    return next(new ErrorResponse('Invalid email or password', 401))
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res,next) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
   return next(new ErrorResponse('User not found', 404))
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
     return next(new ErrorResponse('Invalid email or password', 404))
  }
})

// @desc    Get all users
// @route   GET /api/users/
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc    Delete user
// @route   Delete /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res,next) => {
  const user = await User.findById(req.params.id)
  if (user) {
    await user.remove()
    res.json({
      message: 'User removed',
    })
  } else {
    return next(new ErrorResponse('User not found', 404))
  }
})

// @desc    Get user by id
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    res.json(user)
  } else {
    return next(new ErrorResponse('User not found', 404))
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin || user.isAdmin

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: Boolean(updatedUser.isAdmin),
    })
  } else {
    res.status(404).send('User not found')
    // throw new Error('User not found')
  }
})




export {
  registerUser,
  loginUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getUserProfile,
}
