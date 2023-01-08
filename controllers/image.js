const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key process.env.apiKey");

// const Clarifai = require('clarifai');

//You must add your own API key here from Clarifai. 
// const app = new Clarifai.App({
//     apiKey: process.env.apiKey
// });

const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
        // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
        model_id: "5e026c5fae004ed4a83263ebaabec49e",
        inputs: [{data: {image: {url: req.body.input}}}]
    },
    metadata,
    (err, response) => {
        if (err) {
            console.log("Error: " + err);
            return;
        }

        if (response.status.code !== 10000) {
            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
            return;
        }

        console.log("Predicted concepts, with confidence values:")
        for (const c of response.outputs[0].data.concepts) {
            console.log(c.name + ": " + c.value);
        }
        res.json(response.outputs[0]);
    }
  )
};

// const handleApiCall = (req, res) => {
//   app.models
//     .predict('53e1df302c079b3db8a0a36033ed2d15', req.body.input)
//     .then(data => {
//       res.json(data);
//     })
//     .catch(err => res.status(400).json('unable to work with API'))
// }

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