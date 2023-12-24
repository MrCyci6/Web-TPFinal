const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Import the database query function and configuration
const { dbQuery } = require('../utils/database.js');
const config = require('../config.json');

// POST endpoint for user authentication
router.post('/connect', async (req, res) => {
    
    // Check if the request body is defined
    if(!req.body) return res.status(500).send({error: "Body undefined"});
    
    // Extract email and password from the request body
    let email = req.body.email;
    let password = req.body.password;

    // Check if email and password are provided
    if(!email || !password) return res.status(500).send({error: "Body not completed"});
    
    // Perform a database query to check the user credentials
    dbQuery(`SELECT * FROM users WHERE email="${email}"`, "SELECT", callback => {
        
        // Check for errors in the database query
        if(callback.error) return res.status(500).send(callback.error);
        
        // Check if the user account is not found
        if(callback.body == "") return res.status(403).send({error: "Compte non inscrit"});

        // Check if the provided password matches the stored password
        if(callback.body[0].email == email && callback.body[0].password == password) {
            
            // If authentication is successful, create a JWT token
            let user = {
                email: callback.body[0].email,
                username: callback.body[0].username,
                role: callback.body[0].role,
            }

            // Sign the token with the JWT secret from the configuration
            let token = jwt.sign(user, config.jwtSecret);
            
            // Add the token to the user object
            user.token = token;

            // Send a success response with the user object and token
            return res.status(200).send(user);
        } else {
            // Send an error response for incorrect password
            return res.status(401).send({error: "Mot de passe incorrect"});
        }
    })

})

// Export the router for use in the main application
module.exports = router