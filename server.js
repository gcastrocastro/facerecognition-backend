const { response } = require('express');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const bodyParser = require('body-parser');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db = knex({
    client: 'pg',
    connection: {
      host: process.env.hostname,
      username: process.env.username,
      password: process.env.password,
      database: process.env.database
    }
  });

// We use this to select the data from the database(db) and console.log to check that it's connected.
// console.log(db.select('*').from('users'));

// this is where we are running express
const app = express();

// in order to use req.body, we need to use bodyparser in order to not get an error
app.use(bodyParser.json());

// cors is used to connect backend w frontend 
app.use(cors());

// inside the variable we have the property 'users' which holds an array of objects.
// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'John',
//             email: 'john@gmail.com',
//             password: 'cookies',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '124',
//             name: 'Sally',
//             email: 'sally@gmail.com',
//             password: 'bananas',
//             entries: 0,
//             joined: new Date()
//         }
//     ],
//     login: [
//         {
//             id: '987',
//             hash: '',
//             email: 'john@gmail.com',
//         }
//     ]
// }

app.get('/', (req,res)=> {
    res.json('hi');
    // We no longer need this bc we replaced database with db
    // res.send(database.users);
});

// this is called dependency injection, bc since we're moving each route to separate files,
//  they need db and bcrypt to be passed into them

app.post('/signin', (req, res) => (signin.handleSignin(req, res, db, bcrypt)))
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => (image.handleImage(req, res, db)))
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, ()=> {
    console.log(`app is running on ${process.env.PORT}`);
});












// BCRYPT, taken from https://www.npmjs.com/package/bcrypt-nodejs


// This one is used above
// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });


// these next two are to illustrate how you can compare a password string to the jumbled hash 
// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     console.log('first guess', res)
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     console.log('second guess', res)
// });






/*

Plan out what your API design will look like

DONE 1. We want to have a root route "/" that responds 'this is working'

DONE 2. "" sign in route --> will most likely be a POST request bc we're posting some JSON data.
    Even though we're not creating a new user, we have to POST bc sending private info 
    w query strings is a security issue. We want to send it inside of the body, ideally over https
    so it's hidden
    This will respond with either success or fail.

DONE 3. "" register route --> also POST bc we want to add to our database (via a variable in our server)
    This will return the new created user to make sure it's correct

DONE 4. In home screen, have the ability to access the profile of the user
    ex. /profile/ w optional parameter of (:userID) --> GET request 
    This will return the user info

DONE 5. "" image route --> PUT bc we're updating the rank score every time an image is searched

*/