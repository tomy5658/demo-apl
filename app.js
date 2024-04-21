if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Require Modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const User = require('./models/user');

const ExpressError = require('./utils/ExpressError');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const app = express();

// Connect Mongo DB
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',
    { useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .then(() => {
        console.log('MongoDB Connection Success!!!');
    })
    .catch((err) => {
        console.log('MongoDB Connection Failure...');
        console.log(err);
    });

// Set Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const sessionConfig = {
    name: 'sessionId',
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

// Security
// app.use(helmet());
// const scriptSrcUrls = [
//     'https://cdn.jsdelivr.net'
// ];
// const styleSrcUrls = [
//     'https://cdn.jsdelivr.net'
// ];
// const connectSrcUrls = [
//     'https://api.mabbox.com'
// ];
// const fontSrcUrls = [];
// const imgSrcUrls = [
//     `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
//     'https://images.unsplash.com'
// ];
// app.use(helmet.contentSecurityPolicy({
//     directives: {
//         defaultSrc: [],
//         connectSrc: ["'self'", ...connectSrcUrls],
//         scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//         styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//         workerSrc: ["'self'", "blob:"],
//         childSrc: ["blob:"],
//         objectSrc: [],
//         imgSrc: ["'self'", 'blob', 'data', ...imgSrcUrls],
//         fontSrc: ["'self'", ...fontSrcUrls]
//     }
// }));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routing
app.get('/', (req, res) => {
    res.render('home');
});

// Routing for Campgrounds
app.use('/campgrounds', campgroundsRoutes);

// Routing for Reviews
app.use('/campgrounds/:id/reviews', reviewRoutes);

// Routing for Users
app.use('/', userRoutes);

// Routing for Not Found Page
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// Custom Error Handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Problem Caused';
    console.log('Error happen!!!!!!!!!!!!!!!!!!!!!!!');
    res.status(statusCode).render('error', { err });
});

// Start Server
app.listen('3000', () => {
    console.log('Waiting for Request at Port 3000...');
});