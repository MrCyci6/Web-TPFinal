const express = require('express');
const router = express.Router();
const fs = require('fs');

const config = require('../config.json')

router.post('/closeTicket', (req, res) => {

    if(!req.body) return res.status(500).send({error: "Body undefined"});
    const number = req.body.number;
    if(!number) return res.status(500).send({error: "Bad body format"});
    if(!fs.existsSync(`./tickets/ticket-${number}.json`)) return res.status(404).send({error: `Ticket not found`});
    
    const content = JSON.parse(fs.readFileSync(`./tickets/ticket-${number}.json`, 'utf-8'));
    if(!content.title || !content.description || !content.email) return res.status(500).send({error: `Ticket not completed`});

    content.status = "close";

    fs.writeFileSync(`./tickets/ticket-${number}.json`, JSON.stringify(content))
    res.status(200).send("good")

})

module.exports = router