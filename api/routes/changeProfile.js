const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { dbQuery } = require('../utils/database.js');
const config = require('../config.json');

router.post('/changeprofile', async (req, res) => {
    
    if(!req.body) return res.status(500).send({error: "Body undefined"});
    let newUsername = req.body.newUsername;
    let newPassword = req.body.newPassword;
    let email = req.body.email;
    if(!email) return res.status(500).send({error: "Email not found"});

    if(newUsername) {
        dbQuery(`UPDATE users SET username="${newUsername}" WHERE email="${email}"`, "UPDATE", callback => {
            if(callback.error) return res.status(500).send(callback.error);
    
            return res.status(200).send({succes: `Username changed`});
        })
    } else if(newPassword) {
        dbQuery(`UPDATE users SET password="${newPassword}" WHERE email="${email}"`, "UPDATE", callback => {
            if(callback.error) return res.status(500).send(callback.error);
    
            return res.status(200).send({succes: `Password changed`});
        })
    } else {
        return res.status(500).send({error: `Username nnd Password undefined`});
    }

});

module.exports = router