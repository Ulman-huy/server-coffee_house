const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./config/db')
const route = require('./routes');
const handlebars = require('express-handlebars');
const path = require('path');
const port = 3000;

const app = express();
app.use(express.urlencoded());  
app.use(cors()); 
app.use(morgan('combined')); 
   
db.connect(); // Connect database

app.use(express.static(path.join(__dirname, 'public'))); 

app.engine('hbs', handlebars.engine({ 
    extname: '.hbs' 
}))  
app.set('view engine', '.hbs');
app.set('views', './src/views');

route(app);

app.listen(port, () => console.log('Server is running on port: ', port));

// test