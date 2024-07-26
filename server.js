const express = require ('express')
var _ = require('lodash');
const app = express()
const db = require('./db')

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // stored in req.body


app.get('/', function (req, res) {
    res.send('Hello Welcome to Our Hotel!')
  })


// importing the router files
const personRoutes = require('./routes/personRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');

//use the router
app.use('/person', personRoutes);
app.use('/menuitems', menuItemRoutes);

  app.listen(3000, ()=>{
    console.log('Server run on port 3000');
})
