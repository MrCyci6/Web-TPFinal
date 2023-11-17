const express = require('express');
const router = express.Router();
const mariadb = require('mariadb');

const config = require('../config.json')
const db = mariadb.createPool(config.database);

router.post('/database/:method', async (req, res) => {
    
    if(!req.body || !req.params) return res.status(500).send({error: "Body undefined"})
    let method = req.params.method;
    let request = req.body.request;
    if(!request || !method) return res.status(500).send({error: "Body not completed"})

    let con = await db.getConnection();
    if(!con) return res.status(500).send({error: "Error will connecting to database"});

    switch(method) {
        case "INSERT":
            con.query(request)
                .then(resp => {
                    con.release();
                    con.end();
                })
                .catch(e => {
                    console.log(`[API ERROR][DATABASE ] - ${e}`);
                    con.release();
                    con.end();
                    return res.status(500).send({error: "Error will request with database"});
                });
            
            break;
        default:
    }
    
    if(bans == "") return interaction.reply({content: `Aucun bannissement sur le serveur`})

})

module.exports = router