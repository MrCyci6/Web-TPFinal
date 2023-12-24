const express = require('express');
const router = express.Router();

const config = require('../config.json');

// POST endpoint for user logout
router.post('/logout', async (req, res) => {
    
    // Clear the token cookie
    res.clearCookie('token');

    // Send a success response indicating successful disconnection
    res.status(200).send({succes: "Succesfully deconnected"});
})

// Export the router for use in the main application
module.exports = router