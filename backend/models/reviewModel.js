const mongoose = require("mongoose");
const Grocery = require("./groceryModel");

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "rating is required"],
    },
    comment: {
      type: "String",
      required: [true, "comment is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    item: {
      type: mongoose.Schema.ObjectId,
      ref: "groceryItems",
      required: [true, "Id of item is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: [true, "Id of user is required"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.indexes({item: 1, user: 1}, {unique: true});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

reviewSchema.statics.calcAvgRating = async function (itemId) {
  const result = await this.aggregate([
    {
      $match: { item: itemId },
    },
    {
      $group: {
        _id: "$item",
        nRatings: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if(result){
    Grocery.findByIdAndUpdate(itemId, {
        ratingsQuantity: result[0].nRatings,
        averageRating: result[0].avgRating,
    });
  }else {
    Grocery.findByIdAndUpdate(itemId, {
        ratingsQuantity: 0,
        averageRating: 4.5,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAvgRating(this.item);
});

const Review = mongoose.model("Reviews", reviewSchema);

module.exports = Review;
