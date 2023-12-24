const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Import the database query function and configuration
const { dbQuery } = require('../utils/database.js');
const config = require('../config.json');

// POST endpoint for user registration
router.post('/register', async (req, res) => {
    
    // Check if the request body is defined
    if(!req.body) return res.status(500).send({error: "Body undefined"});
    
    // Extract user registration details from the request body
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    
    // Check if required fields are present in the request body
    if(!email || !password || !username) return res.status(500).send({error: "Body not completed"});
    
    // Check if a user with the given email already exists
    dbQuery(`SELECT * FROM users WHERE email="${email}"`, "SELECT", callback => {
        
        if(callback.error) return res.status(500).send(callback.error);
        
        // If a user with the given email already exists, return a 403 error
        if(callback.body != "") return res.status(403).send({error: "Compte déjà inscrit"});

        // If the user does not exist, insert the new user into the database
        dbQuery(`INSERT INTO users (email, username, password, role) VALUES ("${email}", "${username}", "${password}", "member")`, "INSERT", callback => {

            // Check for errors during the database insertion
            if(callback.error) return res.status(500).send(callback.error);
            
            // Create a user object for generating a JWT token
            let user = {
                email: email,
                username: username,
                role: "member",
            }

            // Generate a JWT token for the new user
            let token = jwt.sign(user, config.jwtSecret);
            user.token = token;

            // Send a success response with the user details and token
            return res.status(200).send(user);
        });
    });
});

// Export the router for use in the main application
module.exports = router