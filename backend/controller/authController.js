const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken');
const AppError = require("./../utils/appError");
const User = require("./../models/userModel");
const {promisify} = require('util'); 
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const crypto = require('crypto');
dotenv.config({path:'./config.env' });

const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
    }
});

const signToken = (id, expiresIn) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn});
};

const createSendToken = (user, statusCode, res) => {
  
  const accessToken = signToken(user._id, process.env.JWT_ACCESS_EXPIRES_IN); 
  const refreshToken = signToken(user._id, process.env.JWT_REFRESH_EXPIRES_IN); 

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    sameSite: 'None',
    secure: true, // Ensure secure cookies in production
  };

  // remove the password field from the output only
  user.password = undefined;
  res
  .cookie("jwt", refreshToken, cookieOptions)
  .status(statusCode)
  .json({
    status: 'success',
    data: {
      user,
      accessToken
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  // id is payload
  createSendToken(newUser, 201, res);
});

exports.logOut = catchAsync(async (req, res, next) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() - 1000
    ),
    httpOnly: true
  }

  res.cookie('jwt', 'logout', cookieOptions);
  res.status(200).json({status: 'success'});
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide an email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.refresh = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.jwt;
  console.log(refreshToken);
  if (!refreshToken) return res.status(401).json({ status: 'fail', message: 'No refresh token' });

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ status: 'fail', message: 'Invalid refresh token' });

    const newAccessToken = signToken(decoded.id, process.env.JWT_ACCESS_EXPIRES_IN);
    res.status(200).json({ status: 'success', accessToken: newAccessToken });
  });
})

exports.protect = catchAsync( async (req, res, next) => {
    let token;
    if(req.cookie.jwt) {
        token = req.cookie.jwt
    }

    if(!token) {
        return next(
            new AppError('You are not Logged in')
        )
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const freshUser = await User.findById(decoded.id);
    if(!freshUser) {
        return next(
            new AppError('Invalid token', 400)
        )
    }
    if(freshUser.isPasswordChanged(decoded.iat)) {
        return next(new AppError("User has recently changed the password"))
    }
    req.user = freshUser;
    next();
}) 

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError('You do not have permission to perform this action', 403),
        );
      }
      next();
    };
  };


exports.forgotPassword  = catchAsync (async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user) return next(new AppError('There are no user with this email'));

    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/freshcart/user/resetPassword/${resetToken}`;

    const message = `RESET URL: ${resetURL}`
    try {
        let details = {
            from:{
              name: 'FreshCart',
              address: process.env.USER_EMAIL
            },
            to: user.email,
            subject: 'Reset Password',
            text: message
        }
        mailTransporter.sendMail(details);
    } catch(err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});
        console.log(err);
        return next(new AppError('There was an error sending the email. Please try again later.', 500));
    }   

    res.status(200).json({
        status: 'success',
        message: 'Email sent!'
    });
});

exports.resetPassword = catchAsync( async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}});

    if(!user) return next(new AppError('Token is invalid or has expired.', 400));

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if(!await user.isPasswordCorrect(req.body.currentPassword, user.password)) return next(new AppError('Incorrect password.'));

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    createSendToken( user, 200, res);
})
  