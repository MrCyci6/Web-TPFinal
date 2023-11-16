const express = require('express')
const fs = require('fs')
const cors = require('cors');

const config = require('./config.json')

const app = express()
app.use(cors());
app.use(express.json())
//app.set('view engine', 'ejs');
//app.use(express.static('public'));

fs.readdirSync("./routes").forEach(file => {
	
	if(!file.endsWith('.js')) return   
    
    app.use('/', require(`./routes/${file}`))     
    console.log(`>>> route : ${file}`)
})

	
try {

	let port = config.port
	app.listen(port)
	
	console.log(`- API enabled on ${config.host}:${port}`)

} catch (e) {
	console.log(`[API ERROR][START] - ${e}`)
}