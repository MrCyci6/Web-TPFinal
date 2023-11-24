const express = require('express');
const router = express.Router();

const fs = require('fs')

const config = require('../config.json')
let ticketCount = 0;
ticketCountMaj();

router.post('/createTicket', (req, res) => {

    if(!req.body) return res.status(500).send({error: "Body undefined"});
    const reqSubject = req.body.subject;
    const reqDescription = req.body.description;
    const email = req.body.email;
    if(!reqSubject || !reqDescription || !email) {
        return res.status(500).send({error: "Bad body format"});
    }

    let description = "";
    reqDescription.split("").forEach(char => {
        description += char.replace('"', "'").replace(/\n/g, " ");
    });
    let subject = "";
    reqSubject.split("").forEach(char => {
        subject += char.replace('"', "'").replace(/\n/g, " ");
    });

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

    const fileName = `./tickets/ticket-${pad(ticketCount, 3)}.json`;

    fs.writeFile(fileName, ticketContent, (e) => {
        if (e) {
            console.error(`[API ERROR][TICKET] - ${e}`);
            res.status(500).send({error: "Error will creating ticket"});
        } else {
            res.status(200).send('Le ticket a été créé avec succès.');
            ticketCount++;
        }
    });
})


function pad(num, size) {
    return ("000" + num).slice(size * -1);
}

function ticketCountMaj() {
    fs.readdirSync('./tickets').forEach(ticket => {
        if(!ticket.toLocaleLowerCase().startsWith("ticket-")) return;
        ticketCount++;
    })
}

module.exports = router