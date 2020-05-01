var host   = 'mysql';
var user   = 'root';
var password   = 'r00t';
var db   = 'sms';

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