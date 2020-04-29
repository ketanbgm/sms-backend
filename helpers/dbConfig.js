//connection properties
var host   = process.env.MYSQL_HOST;
var user   = process.env.MYSQL_USER;
var password   = process.env.MYSQL_PASS;
var db   = process.env.SMS_DBNAME;
// var Vdb   = process.env.VOLTAS_VOLTAS_DBNAME;

module.exports = {
    'connection' : {
        connectionLimit : 30, 
        host     : host, 
        user     : user, 
        password : password, 
        database : db, 
        debug    :  false,
        dateStrings: 'date'
    }

};
