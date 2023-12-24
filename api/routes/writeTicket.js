const express = require('express');
const router = express.Router();
const fs = require('fs');

const config = require('../config.json')

// Route to write a message to a ticket
router.post('/writeTicket', (req, res) => {

    // Check if the request body is defined
    if(!req.body) return res.status(500).send({error: "Body undefined"});

    // Extract message, username, and ticket number from the request body
    const message = req.body.message;
    const user = req.body.username;
    const number = req.body.number;

    // Check if required fields are present in the request body
    if(!message || !user || !number) return res.status(500).send({error: "Bad body format"});
    
    // Check if the ticket file exists
    if(!fs.existsSync(`./tickets/ticket-${number}.json`)) return res.status(404).send({error: `Ticket not found`});
    
    // Read the content of the ticket file
    const content = JSON.parse(fs.readFileSync(`./tickets/ticket-${number}.json`, 'utf-8'));
    
    // Check if the ticket is completed
    if(!content.title || !content.description || !content.email) return res.status(500).send({error: `Ticket not completed`});

    // Add the new message to the ticket
    content.messages.push({
        "utilisateur": user,
        "message": message
    });


    // Write the updated content back to the ticket file
    fs.writeFileSync(`./tickets/ticket-${number}.json`, JSON.stringify(content));

    // Send a 200 (OK) response
    res.status(200).send("good")

})

// Export the router for use in the main application
module.exports = router