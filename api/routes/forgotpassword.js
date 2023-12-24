const express = require('express');
const router = express.Router();

// Import the database query function and configuration
const { dbQuery } = require('../utils/database.js');
const config = require('../config.json');

// POST endpoint for password recovery
router.post('/forgotpassword', async (req, res) => {
    
    // Check if the request body is defined
    if(!req.body) return res.status(500).send({error: "Body undefined"});
    
    // Extract email and password from the request body
    let email = req.body.email;
    let password = req.body.password;
    
    // Check if email and password are provided
    if(!email || !password) return res.status(500).send({error: "Body not completed"});

    // Perform a database query to retrieve user information
    dbQuery(`SELECT * FROM users WHERE email="${email}"`, "SELECT", callback => {
        // Handle errors from the database query
        if(callback.error) return res.status(500).send(callback.error);
        
        // Check if there is no user with the provided email
        if(callback.body == "") return res.status(403).send({error: "Aucun compte relié à cet email"});

        // TODO: Implement password recovery logic here

        // For now, let's assume that the recovery logic is successful

        // Send a success response
        res.status(200).send({ success: "Password recovery successful" });
    })

})

// Export the router for use in the main application
module.exports = router