const express = require('express');
const router = express.Router();
const fs = require('fs')

const config = require('../config.json')

router.get('/readTicket/:number/:email/:role', (req, res) => {

    if(!req.params) return res.status(500).send({error: "Params undefined"});
    let email = req.params.email;
    let number = req.params.number;
    let role = req.params.role;
    if(!email || !number || !role) return res.status(500).send({error: "Bad params format"});

    if(!fs.existsSync(`./tickets/ticket-${number}.json`)) return res.status(404).send({error: "Ticket not found"})
    
    const content = JSON.parse(fs.readFileSync(`./tickets/ticket-${number}.json`, 'utf-8'));
    if(content.email != email && role != "admin") return res.status(403).send({error: "Forbidden"});

    res.status(200).send({
        "title": content.title,
        "description": content.description,
        "status": content.status,
        "messages": content.messages,
        "number": number
    })
})

module.exports = router