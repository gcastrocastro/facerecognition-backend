const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key process.env.apiKey");

// const Clarifai = require('clarifai');
// console.log(Clarifai)

// You must add your own API key here from Clarifai. 
// const app = new Clarifai.App({
//     apiKey: '4cd4379a9d5f4d0d83e258446c340baa'
// });

const handleApiCall = (req, res) => {
    stub.PostModelOutputs(
    {
        model_id: "53e1df302c079b3db8a0a36033ed2d15",
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
        res.json(response);
    }
  )
};

// const handleApiCall = (req, res) => {
//   app.models
//     .predict('a403429f2ddf4b49b307e318f00e528b', req.body.input)
//     .then(data => {
//         console.log(data);
//         res.json(data);
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