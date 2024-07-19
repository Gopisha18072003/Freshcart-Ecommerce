const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Reviews = require('./../models/reviewModel');

exports.getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {};
    if(req.params.itemId) filter = {item: req.params.itemId}

    const reviews = await Reviews.find(filter);
    res.status(200).json({
        status: 'success',
        result: reviews.length,
        data: {reviews}
    })
})

exports.createReview = catchAsync(async (req, res, next) => {
    if(!req.body.item) req.body.item = req.params.itemId
    if(!req.body.user) req.body.user = req.user._id

    const review = await Reviews.create(req.body);
    res.status(200).json({
        status: 'success',
        data: {review}
    })
})