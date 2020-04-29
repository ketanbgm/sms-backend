var dbConn = require('../db');

module.exports = {
    executeQuery : function (query) {
        var Promises = [];
        return new Promise(function (resolve, reject) {
            dbConn.getConnection(function (err, con) {
                if(err){
                    console.log('mysql connection error : ', err);
                    reject(err);
                }else{
                    var exec = function (Query) {
                        //console.log("Executing Query", query)
                        return new Promise(function (resolve, reject) {
                            con.query(Query, function (err, data) {
                                if(err){
                                    reject(err);
                                }else{
                                    resolve(data);
                                }
                            });
                        });
                    };
                    for(var i = 0;i<query.length;i++){
                        //console.log("Adding to Promise", Promises.length)
                        Promises.push(exec(query[i]));
                    }
                }
                Promise.all(Promises).then(function (result) {
                    //console.log("Pool Size", pool._freeConnections.length, pool._allConnections.length, pool._acquiringConnections.length)
                    Promises = []
                    //console.log("================CON CLOSE(1) " + Promises.length + "=========================")
                    con.release();
                    resolve(result);
                }).catch(function (error) {
                    Promises = []
                    //console.log("================CON CLOSE(2) " + Promises.length + "=========================")
                    con.release();
                    reject(error);
                })
            })
        })
    }
};
