const express = require('express');
const router = express.Router();
const fs = require('fs');

// Import the configuration
const config = require('../config.json');
const { deserialize } = require('v8');

// Import the configuration
let ticketCount = 0;
ticketCountMaj();

// POST endpoint for creating a new ticket
router.post('/createTicket', (req, res) => {

    // Check if the request body is defined
    if(!req.body) return res.status(500).send({error: "Body undefined"});

    // Extract subject, description, and email from the request body
    const reqSubject = req.body.subject;
    const reqDescription = req.body.description;
    const email = req.body.email;
    
    // Check if the required fields are present in the request body
    if(!reqSubject || !reqDescription || !email) {
        return res.status(500).send({error: "Bad body format"});
    }

    // Sanitize and process the subject and description
    let description = sanitizeText(reqDescription);
    let subject = sanitizeText(reqSubject);

    // Define the ticket content
    const ticketContent = `{
        "title": "${subject}",
        "description": "${description}",
        "email": "${email}",
        "status": "open",
        "messages": [
            {
                "utilisateur": "${email}",
                "message": "${description}"
            }
        ]
    }`;

    // Define the file name based on the ticket count
    const fileName = `./tickets/ticket-${pad(ticketCount, 3)}.json`;

    // Write the ticket content to a file
    fs.writeFile(fileName, ticketContent, (e) => {
        if (e) {
            console.error(`[API ERROR][TICKET] - ${e}`);
            res.status(500).send({error: "Error will creating ticket"});
        } else {
            // Send a success response
            res.status(200).send('Le ticket a été créé avec succès.');
            // Increment the ticket count
            ticketCount++;
        }
    });
})

// Function to pad numbers with leading zeros
function pad(num, size) {
    return ("000" + num).slice(size * -1);
}

// Function to update the ticket count based on existing tickets
function ticketCountMaj() {
    fs.readdirSync('./tickets').forEach(ticket => {
        if(!ticket.toLocaleLowerCase().startsWith("ticket-")) return;
        ticketCount++;
    })
}

// Function to sanitize and format text (replace quotes and newlines)
function sanitizeText(text) {
    let sanitizedText = "";
    text.split("").forEach(char => {
        sanitizedText += char.replace('"', "'").replace(/\n/g, " ");
    });
    return sanitizedText;
}

// Export the router for use in the main application
module.exports = router