const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Import the dbQuery function for interacting with the database
const { dbQuery } = require('../utils/database.js');

// Import the configuration
const config = require('../config.json');

// POST endpoint for changing user profile information
router.post('/changeprofile', async (req, res) => {
    
    // Check if the request body is defined
    if(!req.body) return res.status(500).send({error: "Body undefined"});

    // Extract information from the request body
    let newUsername = req.body.newUsername;
    let newPassword = req.body.newPassword;
    let email = req.body.email;

    // Check if email is provided
    if(!email) return res.status(500).send({error: "Email not found"});

    // Check if either newUsername or newPassword is provided
    if(newUsername) {
        // Update the username in the database
        dbQuery(`UPDATE users SET username="${newUsername}" WHERE email="${email}"`, "UPDATE", callback => {
            if(callback.error) return res.status(500).send(callback.error);
    
            // Send success response
            return res.status(200).send({succes: `Username changed`});
        })
    } else if(newPassword) {
        // Update the password in the database
        dbQuery(`UPDATE users SET password="${newPassword}" WHERE email="${email}"`, "UPDATE", callback => {
            if(callback.error) return res.status(500).send(callback.error);
    
            // Send success response
            return res.status(200).send({succes: `Password changed`});
        })
    } else {
        // If both newUsername and newPassword are undefined
        return res.status(500).send({error: `Username nnd Password undefined`});
    }

});

// Export the router for use in the main application
module.exports = router