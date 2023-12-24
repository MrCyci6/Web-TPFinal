const express = require('express');
const router = express.Router();
const fs = require('fs');

// Import the configuration
const config = require('../config.json')

// GET endpoint for listing tickets
router.get('/listTicket/:email/:role', (req, res) => {
    
    // Check if the request parameters are defined
    if(!req.params) return res.status(500).send({error: "Params undefined"});
    
    // Extract email and role from the request parameters
    let email = req.params.email;
    let role = req.params.role;
    
    // Check if email and role are provided
    if(!email || !role) return res.status(500).send({error: "Bad params format"});

    // Initialize an array to store ticket information
    let tickets = [];

    // Read the contents of the 'tickets' directory
    fs.readdirSync('./tickets').forEach(ticket => {
        // Exclude the file named 'ticket-000.json' and non-JSON files
        if(ticket.toLocaleLowerCase() == "ticket-000.json" || !ticket.toLocaleLowerCase().endsWith(".json")) return;
        
        // Read the content of each ticket file
        const content = JSON.parse(fs.readFileSync('./tickets/' + ticket, 'utf-8'));
        
        // Check if the ticket information is complete
        if(!content.title || !content.description || !content.email || !content.status) return res.status(500).send({error: "Ticket was not completed"})
        
        // Check the role to determine whether to include the ticket in the response
        if(role == "admin") {
            tickets.push({
                title: content.title,
                description: content.description,
                email: content.email,
                status: content.status,
                number: (ticket.split("-")[1]).split(".")[0]
            })
        } else {
            if(content.email == email) {
                tickets.push({
                    title: content.title,
                    description: content.description,
                    email: content.email,
                    status: content.status,
                    number: (ticket.split("-")[1]).split(".")[0]
                })
            }
        }
    });

    // Send a success response with the list of tickets
    return res.status(200).send(tickets);
})

// Export the router for use in the main application
module.exports = router