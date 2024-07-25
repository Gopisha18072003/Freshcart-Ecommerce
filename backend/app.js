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

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());


app.use(cors({ 
    origin: 'http://localhost:5173',
    credentials: true,
    sameSite: 'Strict',
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

app.use(express.json({
    limit: '10kb'
}));

const limitter = rateLimiter({
    max: 100,
    window: 60*60*1000,
    message: 'Too many requests this IP, please try again later!'
});

app.use('/api', limitter);
app.use('/api/v1/freshcart/', groceryRouter);
app.use('/api/v1/freshcart/user', UserRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Could not find the ${req.originalUrl} route`, 404));
})
app.use(globalErrorHandler); 
module.exports = app;