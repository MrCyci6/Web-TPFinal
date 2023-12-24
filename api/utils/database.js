// Import the MariaDB library
const mariadb = require('mariadb');

// Import the database configuration from config.json
const config = require('../config.json');

// Create a MariaDB connection pool using the provided configuration
const db = mariadb.createPool(config.database);

// Function for executing database queries
function dbQuery(request, method, callback) {

    // Obtain a connection from the pool
    db.getConnection()
        .then(connection => {

            // Check the method type and execute the corresponding query
            if(method == "INSERT" || method == "SELECT" || method == "UPDATE") {

                connection.query(request)
                    .then(resp => {
                        // Release the connection back to the pool
                        connection.release();
                                                
                        // Invoke the provided callback with the query result
                        callback({body: resp});
                    })
                    .catch(e => {
                        // Log an error if the query execution fails
                        console.log(`[API ERROR][DATABASE QUERY] - ${e}`);

                        // Release the connection back to the pool
                        connection.release();

                        // Invoke the provided callback with an error message
                        callback({error: "Error will request with database"});
                    });

            } else if (method == "DELETE") {
                // Handling DELETE queries could be added here if needed
                return;
            } else {
                // Handle other types of queries if necessary
                return;
            }
        })
        .catch(e => {
            // Log an error if obtaining a database connection fails
            console.log(`[API ERROR][DATABASE CONNECT] - ${e}`)

            // Invoke the provided callback with an error message
            callback({error: "Error will connecting to database"});
        });

}

// Export the dbQuery function for use in other parts of the application
module.exports = {
    dbQuery,
}