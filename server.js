// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require Mongoose
var mongoose = require('mongoose');
// this is the external validator the platform talked about
// var validate = require('mongoose-validator');
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/basic_mongoose');

//define your validator for external validator
// var nameValidator = [
//     validate({
//       validator: 'isLength',
//       arguments: [3, 50],
//       message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
//     }),
//     validate({
//       validator: 'isAlphanumeric',
//       passIfEmpty: true,
//       message: 'Name should contain alpha-numeric characters only'
//     })
//     // validate({
//     //     validator: 'isEmail',
//     //     passIfEmpty: true,
//     //     message: 'Should be an email'
//     // })
// ];


var UserQuoteSchema = new mongoose.Schema({
    name:  { type: String, required: true},
    // last_name: { type: String, required: true, maxlength: 20 },
    quote: { type: String, required: true},
    // email: { type: String, required: true }
}, {timestamps: true });

mongoose.model('UserQuote', UserQuoteSchema); // We are setting this Schema in our Models as 'User'
var UserQuote = mongoose.model('UserQuote') // We are retrieving this Schema from our Models, named 'User'
// Use native promises
mongoose.Promise = global.Promise;

// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');

// Routes
// Root Request
app.get('/', function(req, res) {
    res.render('index')
})

// Add Quotes Request 
app.post('/quotes', function(req, res) {
    console.log("POST DATA", req.body);
    var quote = new UserQuote(req.body);
    // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    quote.save(function(err) {
        // if there is an error console.log that something went wrong!
        if(err) {
            console.log('something went wrong saving user');
            console.log(quote.errors);
            res.render('quotes', {errors: quote.errors});
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully added a user!');
            res.redirect('quotes');
        }
    })
})

app.get('/quotes', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    // .sort -createdAt to sort descending
    UserQuote.find({}).sort('-createdAt').exec(function(err, quotes) {
        if(err) {
            console.log("didn't get quote data");
            res.render('quotes');
        } else {
            console.log("got quote data");
            res.render('quotes', {userQuotes: quotes});
        }
      })
})


// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
