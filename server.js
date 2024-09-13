const express = require('express');
const initApiRoutes = require('./routes');
require("dotenv").config()
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');



const hostName = process.env.HOST_NAME;
const port = process.env.PORT || 8000;

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

initApiRoutes(app)

app.listen(port, hostName, () => {
    console.log(`Example app listening on http://${hostName}:${port}/api/v1`)
})


app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;