const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { dbQuery } = require('../utils/database.js');
const config = require('../config.json');

router.post('/connect', async (req, res) => {

    if(!req.body) return res.status(500).send({error: "Body undefined"});
    let email = req.body.email;
    let password = req.body.password;
    if(!email || !password) return res.status(500).send({error: "Body not completed"});
    
    dbQuery(`SELECT * FROM users WHERE email="${email}"`, "SELECT", callback => {
        
        if(callback.error) return res.status(500).send(callback.error);
        
        if(callback.body == "") return res.status(403).send({error: "Compte non inscrit"});

        if(callback.body[0].email == email && callback.body[0].password == password) {
            
            let user = {
                email: callback.body[0].email,
                username: callback.body[0].username,
                role: callback.body[0].role,
            }

            let token = jwt.sign(user, config.jwtSecret);
            user.token = token;

            return res.status(200).send(user);
        } else {
            return res.status(401).send({error: "Mot de passe incorrect"});
        }
    })

})

module.exports = router