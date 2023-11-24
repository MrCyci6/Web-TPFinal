const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { dbQuery } = require('../utils/database.js');
const config = require('../config.json');

router.post('/register', async (req, res) => {
    
    if(!req.body) return res.status(500).send({error: "Body undefined"});
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    if(!email || !password || !username) return res.status(500).send({error: "Body not completed"});
    
    dbQuery(`SELECT * FROM users WHERE email="${email}"`, "SELECT", callback => {
        
        if(callback.error) return res.status(500).send(callback.error);
        
        if(callback.body != "") return res.status(403).send({error: "Compte déjà inscrit"});

        dbQuery(`INSERT INTO users (email, username, password, role) VALUES ("${email}", "${username}", "${password}", "member")`, "INSERT", callback => {
            if(callback.error) return res.status(500).send(callback.error);
            console.log(callback)
            let user = {
                email: email,
                username: username,
                role: "member",
            }

            let token = jwt.sign(user, config.jwtSecret);
            user.token = token;

            return res.status(200).send(user);
        });
    })

})

module.exports = router