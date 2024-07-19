const APIFeatures = require("./../utils/apiFeatures");
const GroceryItems = require("./../models/groceryModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllGroceries = catchAsync(async (req, res, next) => {
        const features = new APIFeatures(GroceryItems.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const groceries = await features.query;
      res.status(200).json({
        status: "Success",
        length: groceries.length,
        data: { groceries },
      });
});



exports.getGrocery = catchAsync(async (req, res, next) => {
    const grocery = await GroceryItems.findById(req.params.id);
    if(grocery == null) {
      return next(new AppError('No item found for this id', 404));
    }
    res.status(200).json({
      status: "Success",
      data: { grocery },
    });
});
 
exports.addGrocery = catchAsync(async (req, res, next) => {
  const grocery = await GroceryItems.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: { grocery}
  })
});

exports.deleteGrocery = catchAsync(async (req, res, next) => {
  await GroceryItems.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'Success',
    data: null
  })
})

exports.updateGrocery = catchAsync(async (req, res, next) => {
  const grocery = await GroceryItems.findByIdAndUpdate(req.params.id, req.body);

  res.status(201).json({
    status: 'Success',
    data: {grocery}
  })
})