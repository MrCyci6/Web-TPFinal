const express = require('express');
const router = express.Router();
const fs = require('fs')

// Import configuration
const config = require('../config.json')

// GET endpoint for reading a ticket
router.get('/readTicket/:number/:email/:role', (req, res) => {

    // Check if parameters are defined in the request
    if(!req.params) return res.status(500).send({error: "Params undefined"});
    
    // Extract parameters from the request
    let email = req.params.email;
    let number = req.params.number;
    let role = req.params.role;

    // Check if required parameters are present
    if(!email || !number || !role) return res.status(500).send({error: "Bad params format"});

    // Check if the ticket file exists
    if(!fs.existsSync(`./tickets/ticket-${number}.json`)) return res.status(404).send({error: "Ticket not found"})
    
    // Read the content of the ticket file
    const content = JSON.parse(fs.readFileSync(`./tickets/ticket-${number}.json`, 'utf-8'));
    
    // Check if the user has permission to access the ticket
    if(content.email != email && role != "admin") return res.status(403).send({error: "Forbidden"});

    // Send a success response with the ticket details
    res.status(200).send({
        "title": content.title,
        "description": content.description,
        "status": content.status,
        "messages": content.messages,
        "number": number
    });
});

// Export the router for use in the main application
module.exports = router