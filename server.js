if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser'); //to easily obtain the data the server is sending on the forms 

const indexRouter = require('./routes/index'); //this is not a route, is a folder path. Module name is prefixed with ./, as it’s a local file. Also note that there’s no need to add the file extension.
const authorRouter = require('./routes/authors');  // here we are saying what to do with all the routes of this type
const bookRouter = require('./routes/books'); 

app.set('view engine', 'ejs');  // this indicate the template we want to use, ejs, pug, mustache...BC template is related to express, we do app.set
app.set('views', __dirname + '/views'); // where the template files are located. __dirname gives the ABSOLUTE PATH 
app.set('layout', 'layouts/layout'); // all res.renders will be desplayed here, on -body
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({limit : '10mb', extended:false})) //to easily read forms values and ingreasing when we upload files. Parses query string data in the URL (e.g. /profile?id=5) and puts this in request.query

const mongoose = require('mongoose');   
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true} );  //changed due error original mongoose.connect(process.env.DATABASE_URL);
// mongoose.set('useUnifiedTopology', true); //i added this dut the error
const bd = mongoose.connection;
bd.on('error', error => console.error(error) );
bd.once('open', () => console.log('Connected to Mongoose') );

app.use('/', indexRouter); // route files that were required are attached to our app
app.use('/authors', authorRouter); //here we are collecting all the calls for this route and send the manage to the author route
app.use('/books', bookRouter);

app.listen(process.env.PORT || 3000);