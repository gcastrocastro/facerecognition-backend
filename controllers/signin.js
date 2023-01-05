const handleSignin = (req,res, db, bcrypt)=> {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                .where('email', '=', email)
                .then(user => {
                    res.json(user[0]);
                })
                .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
    .catch(err => res.status(400).json('wrong credentials'))

    // in order to use req.body, we need to use bodyparser in order to not get an error
    // if (req.body.email === database.users[0].email && 
    //     req.body.password === database.users[0].password) {
    //         res.json('success');
    //     } else {
    //         res.status(400).json('error logging in');
    //     }

    // res.send('signin');
    // res.json('signin');
    // using json instead of send includes some added features, so we receive a json string this way
    
}   

module.exports = {
    handleSignin: handleSignin
};