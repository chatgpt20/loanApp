const jwt = require('jsonwebtoken');
const User = require('../models/User');

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    console.log(id);
    return jwt.sign({ id }, 'this is my secret 1234',{
        expiresIn: maxAge
    });
}

module.exports.login_get = (req,res) => {
    res.render('signin');
}

module.exports.login_post = async (req,res) => {
    // console.log(req.body);

    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await User.login(username,password);
        // console.log(user.username);
        if (user.username) {
            // console.log(user.id);
        const token = createToken(user.id);
        res.cookie('jwt',token,{ httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({user:user.id})
        } else {
            res.status(400).json({error: user.error});
        }
    } catch (err) {
        res.status(400).json({error: err});
    }
    
}