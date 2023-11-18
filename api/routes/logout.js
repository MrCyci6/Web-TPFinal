const express = require('express');
const router = express.Router();

const config = require('../config.json');

router.post('/logout', async (req, res) => {
    
    res.clearCookie('token');

    res.status(200).send({succes: "Succesfully deconnected"});
})

module.exports = router