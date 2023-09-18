var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require ('cors')
const {decodeToken} = require ('./middleware')
const productRoute = require ('./app/product/routes')
const categoryRoute = require ('./app/category/routes')
const tagsRoute = require ('./app/tags/routes')
const authRoute = require ('./app/auth/routes')
const delveryAddressRoute = require ('./app/deliveryAdress/routes')
const cartRoute = require ('./app/cart/routes')
const orderRoute = require ('./app/order/routes')
const invoiceRoute = require ('./app/invoice/routes')
const bodyParser = require('express')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(cors())
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/images', express.static('public'));
app.use(decodeToken())


app.use('/auth', authRoute)
app.use('/api', productRoute)
app.use('/api', categoryRoute)
app.use('/api', tagsRoute)
app.use('/api', delveryAddressRoute)
app.use('/api', cartRoute)
app.use('/api', orderRoute)
app.use('/api', invoiceRoute)


//home
app.use('/', function(req,res){
  res.render('index',{
    title: 'Fajar API'
  })
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  return res.render('error');
});

module.exports = app;
