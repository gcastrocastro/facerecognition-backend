const Clarifai = require('clarifai');

//You must add your own API key here from Clarifai. 
const app = new Clarifai.App({
    apiKey: process.env.apiKey
});

const handleApiCall = (req, res) => {
  app.models
    .predict('53e1df302c079b3db8a0a36033ed2d15', req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db)=> {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))

    // let found = false;

    // database.users.forEach( user => {
    //     if (user.id === id) {
    //         found = true;
    //         user.entries++
    //         return res.json(user.entries);
    //     } 
    // })
    //     if (!found) {
    //         res.status(400).json('no user found');
    //     }
}

module.exports = {
    handleImage,
    handleApiCall
}