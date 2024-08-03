const express = require('express');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const groceryRouter = require('./routes/groceryRoutes');
const UserRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controller/errorController');
const cors = require('cors');
const app = express();
const AppError = require('./utils/appError');
const cookieParser = require('cookie-parser');
const path = require('path');
const stripe = require("stripe")(process.env.STRIPE_SECRET)
const bodyParser = require('body-parser');
const Orders = require('./models/ordersModel');

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());


app.use(cors({ 
    origin: '*',
    credentials: true,
}));

app.use(cookieParser());
app.use(hpp({
    whitelist: [
        'price',
        'quantity',
        'ratingsQuantity',
        'ratingsAverage'
    ]
}));

async function fulfillCheckout(session) {
  const userId = session.metadata.userId;
  const items = JSON.parse(session.metadata.items);

  const orderData = {
    userId: userId,
    items: items.map(item => ({
      productId: item.product._id,
      quantity: item.quantity
    })),
    totalAmount: session.amount_total,
    orderDate: new Date()
  };

  const order = new Orders(orderData);
  await order.save();

  console.log(`Order created for session ID: ${session.id}`);
}
app.post('/webhook', bodyParser.raw({type: 'application/json'}), async (request, response) => {
  const payload = request.body;
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.WEBHOOK_SECRET);
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (
    event.type === 'checkout.session.completed'
    || event.type === 'checkout.session.async_payment_succeeded'
  ) {
    fulfillCheckout(event.data.object.id);
  }

  response.status(200).json({status: 'success', message: 'Payment completed'});
});

app.use(express.json({
    limit: '10kb'
}));

const limitter = rateLimiter({
    max: 100,
    window: 60*60*1000,
    message: 'Too many requests this IP, please try again later!'
});
app.use('/uploads/images', express.static(path.join('uploads', 'images')))
app.use('/uploads/items', express.static(path.join('uploads', 'items')))

app.use('/api', limitter);
app.use('/api/v1/freshcart/', groceryRouter);
app.post('/api/v1/freshcart/create-checkout-session', async (req, res) => {
    const products = req.body.cart.items;
    const userId = req.body.userId;
    console.log()
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map((product) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.product.name,
              images: [`${req.protocol}://${req.get('host')}/uploads/items/${product.product.image}`],
            },
            unit_amount: Math.round(product.product.finalPrice * 100), // Convert to cents and round
          },
          quantity: product.quantity,
        })),
        mode: 'payment',
        success_url: 'https://freshcart-frontend.onrender.com/success',
        cancel_url: 'https://freshcart-frontend.onrender.com/cancel',
        metadata: {
          userId: userId,
          items: JSON.stringify(products) // Convert items array to JSON string
        }
      });
    res.json({id: session.id})      

})
app.use('/api/v1/freshcart/user', UserRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Freshcart API!');
});
app.all('*', (req, res, next) => {
    next(new AppError(`Could not find the ${req.originalUrl} route`, 404));
})
app.use(globalErrorHandler); 
module.exports = app;
