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
        timeStamps: true
    }
);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;