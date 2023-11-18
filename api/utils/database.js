const mariadb = require('mariadb');
const config = require('../config.json');

const db = mariadb.createPool(config.database);

function dbQuery(request, method, callback) {

    db.getConnection()
        .then(connection => {
            
            if(method == "INSERT" || method == "SELECT" || method == "UPDATE") {

                connection.query(request)
                    .then(resp => {
                        connection.release();
                        
                        callback({body: resp});
                    })
                    .catch(e => {
                        console.log(`[API ERROR][DATABASE QUERY] - ${e}`);
                        connection.release();

                        callback({error: "Error will request with database"});
                    });

            } else if (method == "DELETE") {

            } else {
                
            }
        })
        .catch(e => {
            console.log(`[API ERROR][DATABASE CONNECT] - ${e}`)
            callback({error: "Error will connecting to database"});
        });

}

module.exports = {
    dbQuery,
}