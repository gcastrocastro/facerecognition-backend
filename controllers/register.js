const handleRegister = (req, res, db, bcrypt) => {

    // we destructure these properties from req.body
    const { email, name, password } = req.body;

    // this is to ensure that if any of the fields are left blank, that a new user won't be registered
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }

    // This is the synchronous way of storing a hash of a password
    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    // We don't include ID bc it's automatically generated, & entries defaults to zero as well
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date()
                }).then(user => {
                // database.users.length-1 grabs the last item in the array
                // res.json(database.users[database.users.length-1]);

                // this is the response we are sending to the front end with the info we are inserting above
                res.json(user[0]);
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    }).catch(err => res.status(400).json('unable to register'))
}

module.exports = {
    handleRegister: handleRegister
};