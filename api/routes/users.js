const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const config = require('../config.json');

// Middleware function to verify and retrieve user information from the token
function getUser(req, res, next) {
    // Check if the token is present in the request parameters
    if(!req.params || !req.params.token) return res.status(403).send({error: "Token not found"});

    // Extract the token from the request parameters
    let token = req.params.token;

    // Verify the token using JWT
    jwt.verify(token, config.jwtSecret, (e, user) => {
        // If there's an error during verification, return a 401 (Unauthorized) response
        if(e) {
            console.log(`[API ERROR][JWT VERIFY] - ${e}`);
            return res.status(401).send({error: "Invalid token"});
        }

        // Attach the user object to the request for further processing
        req.user = user;
        next();
    });
}

// Route to get user information based on the token
router.get('/getuser/:token', getUser, (req, res) => {
    // Send a 200 (OK) response with the user information retrieved from the token
    res.status(200).send(req.user);   
});

// Route to update user information based on the token
router.post('/updateuser/:token', getUser, (req, res) => {

    // Check if the request body is defined
    if(!req.body) return res.status(403).send({error: "Body undefined"});
    
    // Extract new username and email from the request body
    let newUsername = req.body.newUsername;
    let email = req.body.email;

    // Check if required fields are present in the request body
    if(!email || !newUsername) return res.status(403).send({error: "Username or Email not found"});

    // Create a new user object with updated username
    let user = {
        email: req.user.email,
        username: newUsername,
        role: req.user.role,
    }

    // Generate a new token with updated user information
    let token = jwt.sign(user, config.jwtSecret);
    user.token = token;

    // Send a 200 (OK) response with the updated user information and token
    res.status(200).send(user);
});

// Export the router for use in the main application
module.exports = router