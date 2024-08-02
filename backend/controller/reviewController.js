const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Reviews = require('./../models/reviewModel');

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const id = req.params.itemId
    const reviews = await Reviews.find({'product':id});
    if(reviews) {
        res.status(200).json({
            status: 'success',
            result: reviews.length,
            data: {reviews}
        })
    } else {
        res.status(200).json({
            status: 'success',
            result: 0,
            data: {reviews: null}
        })
    }

})

exports.createReview = catchAsync(async (req, res, next) => {
    if(!req.body.product) req.body.product = req.params.itemId
    if(!req.body.user) req.body.user = req.user._id

    const review = await Reviews.create(req.body);
    res.status(200).json({
        status: 'success',
        data: {review}
    })
})