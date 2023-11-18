const express = require('express');
const router = express.Router();

const { dbQuery } = require('../utils/database.js');
const config = require('../config.json');

router.post('/login', async (req, res) => {
    
    if(!req.body) return res.status(500).send({error: "Body undefined"});
    let email = req.body.email;
    let password = req.body.password;
    if(!email || !password) return res.status(500).send({error: "Body not completed"});

    dbQuery(`SELECT * FROM users WHERE email="${email}"`, "SELECT", callback => {
        if(callback.error) return res.status(500).send(callback.error);
        
        if(callback.body == "") return res.status(403).send({error: "Aucun compte relié à cet email"});

        
    })

})

module.exports = router