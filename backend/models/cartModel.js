const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Cart must belongs to a user']
    },
    items: [],
},
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
        timeStamps: true
    }
);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;