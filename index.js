const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const port = 3000;

const app = express();

app.use(cors());
app.use(morgan('combined'));

app.get('/', (req, res, next) =>  {
    res.send('Hello world!')
})

app.listen(port, () => console.log('Server is running on port: ', port));