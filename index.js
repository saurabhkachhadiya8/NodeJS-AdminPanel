const express = require('express');
const app = express();
const port = 8080;

// connect DataBase
const db = require('./config/db');
db();

// attech cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'ejs');

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads/')));

// PassportJS Authentication start
const passport = require('passport');
const passportLocal = require('./config/passportLocal');
const session = require('express-session');
app.use(session({
    secret: 'AdminPanel',
    name: 'AdminPanel',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setUser);
// PassportJS Authentication end

// connect-flash start 
const flash = require('connect-flash');
app.use(flash());
app.use(function (req, res, next) {
    res.locals.message = req.flash();
    return next();
});
// connect-flash end

app.use(express.urlencoded());

app.use('/', require('./routes/indexRoute'));

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log(`server is running on port :- ${port}`);
});