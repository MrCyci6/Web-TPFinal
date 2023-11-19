const express = require('express');
const router = express.Router();
const fs = require('fs');

const config = require('../config.json')

router.get('/listTicket/:email/:role', (req, res) => {
    
    if(!req.params) return res.status(500).send({error: "Params undefined"})
    let email = req.params.email;
    let role = req.params.role;
    if(!email || !role) return res.status(500).send({error: "Bad params format"});


    let tickets = []
    fs.readdirSync('./tickets').forEach(ticket => {
        if(ticket.toLocaleLowerCase() == "ticket-000.json" || !ticket.toLocaleLowerCase().endsWith(".json")) return;
        
        const content = JSON.parse(fs.readFileSync('./tickets/' + ticket, 'utf-8'));
        if(!content.title || !content.description || !content.email || !content.status) return res.status(500).send({error: "Ticket was not completed"})
        
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

    return res.status(200).send(tickets);
})

module.exports = router