// Import required modules
const express = require('express')
const fs = require('fs')
const cors = require('cors');

// Load configuration settings from config.json
const config = require('./config.json')

// Create an instance of Express
const app = express()

// Use Morgan for logging in the 'dev' format
const morgan = require('morgan');
app.use(morgan('dev'));

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Enable JSON parsing for incoming requests
app.use(express.json())
//app.set('view engine', 'ejs');
//app.use(express.static('public'));

// Iterate through files in the 'routes' directory and include them as routes
fs.readdirSync("./routes").forEach(file => {
    // Only include JavaScript files
	if(!file.endsWith('.js')) return   
    
    // Include routes from each file
    app.use('/', require(`./routes/${file}`))     
    console.log(`>>> route : ${file}`)
})
	
// Start the Express app and listen on the specified host and port
try {

	let port = config.port
	app.listen(port, config.host)
	
	console.log(`- API enabled on ${config.host}:${port}`)

} catch (e) {
	console.log(`[API ERROR][START] - ${e}`)
}
