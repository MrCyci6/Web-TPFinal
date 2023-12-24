const express = require('express');
const router = express.Router();
const fs = require('fs');

// Import the configuration
const config = require('../config.json')

// POST endpoint for closing a ticket
router.post('/closeTicket', (req, res) => {

    // Check if the request body is defined
    if(!req.body) return res.status(500).send({error: "Body undefined"});

    // Extract the ticket number from the request body
    const number = req.body.number;
    
    // Check if the ticket number is provided in the correct format
    if(!number) return res.status(500).send({error: "Bad body format"});
    
    // Check if the ticket file exists
    if(!fs.existsSync(`./tickets/ticket-${number}.json`)) return res.status(404).send({error: `Ticket not found`});
    
    // Read the content of the ticket file
    const content = JSON.parse(fs.readFileSync(`./tickets/ticket-${number}.json`, 'utf-8'));

    // Check if the ticket is complete (contains title, description, and email)
    if(!content.title || !content.description || !content.email) return res.status(500).send({error: `Ticket not completed`});

    // Mark the ticket as "closed"
    content.status = "close";

    // Write the updated content back to the ticket file
    fs.writeFileSync(`./tickets/ticket-${number}.json`, JSON.stringify(content));
    
    // Send a success response
    res.status(200).send("good");

})

// Export the router for use in the main application
module.exports = router