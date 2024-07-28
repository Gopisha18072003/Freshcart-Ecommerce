const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');

exports.addItemToCart = catchAsync(async (req, res, next) => {
    const cartData = req.body.cart;
    const user = await User.findById(req.user.id);

    const cart = [...user.cart, ...cartData];
    user.cart = cart;
    user.save({validateBeforeSave: false});

    res.status(200).json({
        status: 'success',
        data: {user}
    });

});

exports.getAllUser = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        data: {users}
    });
});

exports.getMe =  catchAsync(async (req, res, next) => {
    req.params.id = req.user.id;
    next();
})

exports.getUser = catchAsync(async (req, res, next) => {
    const users = await User.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {users}
    });

});

exports.updateUser = catchAsync(async (req, res, next) => {
    const {name, email, address, pincode} = req.body;
    const userId = req.user.id; 
    if(email && name) {
        const data = {'name': name, 'email': email, 'address': address, 'pincode': pincode}
        const user = await User.findByIdAndUpdate(userId, data,
            { new: true, runValidators: true });
        res.status(200).json({
            status: 'success',
            data: {user}
        });
    }
    else {
        res.status(400).json({
            status: 'fail',
            error: {message: 'Email or Name is invalid'}
        });
    }
   
    

});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const users = await User.findByIdAndDelete(req.user.id);
    res.status(200).json({
        status: 'success',
        data: {users}
    });

});

exports.updateOrderHistory = catchAsync(async (req, res, next) => {
    const orderData = req.body.cart;
    const user = req.user;
    const updatedHistory = [...user.orderHistory, ...orderData];
    user.orderHistory = updatedHistory;
    user.save({validateBeforeSave: false});
    
    res.status(200).json({
        status: 'success',
        data: {user}
    });

});

exports.updateCart = catchAsync(async (req, res, next) => {
    const updatedCart = req.body.items;
    const user = req.user; 
    user.cart = updatedCart;
    user.save({validateBeforeSave: false});
    
    res.status(200).json({
        status: 'success',
        data: {user}
    });

});

