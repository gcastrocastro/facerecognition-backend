// require dependencies
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ['knex', 'public']    
  });

// this is where we are running express
const app = express();

// in order to use req.body, we need to use bodyparser in order to not get an error
app.use(express.json());

// cors is used to connect backend w frontend 
app.use(cors());

// this is called dependency injection, bc since we're moving each route to separate files,
//  they need db and bcrypt to be passed into them

app.get('/', (req,res) => { res.send(db.users) });
app.post('/signin', (req, res) => (signin.handleSignin(req, res, db, bcrypt)))
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => (image.handleImage(req, res, db)))
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, ()=> {
    console.log(`app is running on ${process.env.PORT}`);
});