const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./config/db')
const route = require('./routes');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const port = 3000;
 
const app = express();
app.use(express.urlencoded());
db.connect(); // Connect database 

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
app.use(cors()); 
app.use(morgan('combined'));
app.use(session({
    secret: '@5162812/%h$u$y%2**!',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use(express.static(path.join(__dirname, 'public'))); 

app.engine('hbs', handlebars.engine({ 
    extname: '.hbs',
    helpers: {
        formatDate: date => {
            var newsDate  = new Date(date)
            return newsDate.toLocaleDateString("en-US")
        }
    }
}))  
app.set('view engine', '.hbs');
app.set('views', './src/views');

route(app); 

app.listen(port, () => console.log('Server is running on port: ', port));
