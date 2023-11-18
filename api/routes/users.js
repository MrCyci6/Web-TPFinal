const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const config = require('../config.json');

function getUser(req, res, next) {
    if(!req.params || !req.params.token) return res.status(403).send({error: "Token not found"});

    let token = req.params.token;

    jwt.verify(token, config.jwtSecret, (e, user) => {
        if(e) {
            console.log(`[API ERROR][JWT VERIFY] - ${e}`);
            return res.status(401).send({error: "Invalid token"});
        }

        req.user = user;
        next();
    });
}

router.get('/getuser/:token', getUser, (req, res) => {
    res.status(200).send(req.user);   
});

router.post('/updateuser/:token', getUser, (req, res) => {

    if(!req.body) return res.status(403).send({error: "Body undefined"});
    let newUsername = req.body.newUsername;
    let email = req.body.email;
    if(!email || !newUsername) return res.status(403).send({error: "Username or Email not found"});

    let user = {
        email: req.user.email,
        username: newUsername,
        role: req.user.role,
    }

    let token = jwt.sign(user, config.jwtSecret);
    user.token = token;

    res.status(200).send(user);
});

module.exports = router