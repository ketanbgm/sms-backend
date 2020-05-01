const executer = require('../helpers/mysqlExecuter')
const response = require("../helpers/response")
const moment = require('moment');
const fs = require('fs');
path = require('path'),
    filePath = path.join(__dirname, 'data.json');

var getData = async function(req, res, next) {
    let numRows;
    let numPerPage = parseInt(req.body.npp, 10) || 10;
    let page = parseInt(req.body.page, 10) || 1;
    let start_date_from = req.body.start_date_from;
    let start_date_to = req.body.start_date_to;
    let end_date_from = req.body.end_date_from;
    let end_date_to = req.body.end_date_to;
    let sorting = req.body.sorting;
    console.log(start_date_from, end_date_to)

    if(start_date_from && start_date_to){
        start_date_from = moment(start_date_from, 'DD.MM.YYYY').format('YYYY-MM-DD')
        start_date_to = moment(start_date_to, 'DD.MM.YYYY').format('YYYY-MM-DD')
    }
    if(end_date_from && end_date_to){
        end_date_from = moment(end_date_from, 'DD.MM.YYYY').format('YYYY-MM-DD')
        end_date_to = moment(end_date_to, 'DD.MM.YYYY').format('YYYY-MM-DD')
    }


    let numPages;
    page = page - 1;
    let skip = page * numPerPage;
    var limit = skip + ',' + numPerPage;
    var whereClause = '';
    var orderByClause = ' order by ';
    console.log("sorting",sorting)
    if(!sorting) {
        orderByClause = '';
       // orderByClause
    } else {

        if(sorting.city){
            orderByClause = `${orderByClause} city ${sorting.city},`
        }
        if(sorting.price){
            orderByClause = `${orderByClause} price ${sorting.price},`
        }
        if(sorting.start_date){
            orderByClause = `${orderByClause} start_date ${sorting.start_date},`
        }
        if(sorting.end_date){
            orderByClause = `${orderByClause} end_date ${sorting.end_date},`
        }
        if(sorting.status){
            orderByClause = `${orderByClause} status ${sorting.status},`
        }
        if(sorting.color){
            orderByClause = `${orderByClause} color ${sorting.color},`
        }

        orderByClause = orderByClause.substring(0, orderByClause.length - 1); 
    }
    console.log(start_date_from, start_date_to)
    if (start_date_from && start_date_to) {
        whereClause += `and start_date between '${start_date_from}' and '${start_date_to}' `
    }
    if (end_date_from && end_date_to) {
        whereClause += `and end_date between '${end_date_from}' and '${end_date_to}' `
    }
    let countRecords = `SELECT count(*) as numRows FROM city where 1 ${whereClause}`;
    console.log(countRecords)
    let count_result = await executer.executeQuery([countRecords])
    if (count_result[0][0].numRows > 0) {
        numRows = count_result[0][0].numRows;
        numPages = Math.ceil(numRows / numPerPage);
        let getCities = `SELECT * FROM city where 1 ${whereClause}  ${orderByClause}  LIMIT ${limit}`;
        console.log(getCities)
        let reportResult = await executer.executeQuery([getCities])

        // console.log("reportResult", reportResult)
        if (reportResult.length > 0) {
            var responsePayload = {
                results: reportResult[0]
            };
            if (page < numPages) {
                responsePayload.pagination = {
                    total: numRows,
                    current: page + 1,
                    perPage: numPerPage,
                    previous: page > 0 ? page : undefined,
                    next: page + 1 < numPages ? page + 2 : undefined
                }
            } else responsePayload.pagination = {
                err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
            }
            response.returnTrue(req, res, 'Success', responsePayload);
        } else {
            response.returnFalse(req, res, 'No data found', []);
        }
    } else {
        response.returnFalse(req, res, 'No data found', []);
    }
}

var importData = async function(req, res, next) {
    fs.readFile(filePath, 'utf8', (err, result) => {
        if (err) {
            console.log("File read failed:", err)
            return
        } else {
            var parsedRes = JSON.parse(result)
            console.log('File data:', parsedRes)

            for (let record of parsedRes) {
                console.log("record", record)
                var start_date = moment(record.start_date, 'MM-DD-YYYY').format('YYYY-MM-DD')
                var end_date = moment(record.end_date, 'MM-DD-YYYY').format('YYYY-MM-DD')

                const insertQuery = `insert into city (id, city, start_date, end_date, price, status, color) VALUES (${record.id}, '${record.city}', '${start_date}', '${end_date}', ${record.price}, '${record.status}', '${record.color}')`;
                console.log("insertQuery", insertQuery)
                executer.executeQuery([insertQuery]).then(function(result) {
                    let userData = result[0];
                    if (userData.length == 0) {
                        response.returnFalse(req, res, 'User does not exist', "");
                    } else {

                    }
                })
            }

        }
    })
}

var addCity = async function(req,res,next){
    var city = req.body.city;
    var price = req.body.price;
    var status = req.body.status;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var color = req.body.color;
    if(!city){
        response.returnFalse(req, res, 'City is required', []);
    } else if(!price){
        response.returnFalse(req, res, 'price is required', []);
    } else if(!status){
        response.returnFalse(req, res, 'status is required', []);
    } else if(!start_date){
        response.returnFalse(req, res, 'start_date is required', []);
    } else if(!end_date){
        response.returnFalse(req, res, 'end_date is required', []);
    } else if(!color){
        response.returnFalse(req, res, 'color is required', []);
    } else {
        const insertQuery = `insert into city (city, start_date, end_date, price, status, color) VALUES ('${city}', '${start_date}', '${end_date}', ${price}, '${status}', '${color}')`;
        console.log("insertQuery", insertQuery)
        executer.executeQuery([insertQuery]).then(function(result) {
            let userData = result[0];
            if (userData.length == 0) {
                response.returnFalse(req, res, 'User does not exist', "");
            } else {
                response.returnTrue(req, res, 'Success', result[0]);
            }
        })
    }
}

var getOneCity = async function(req,res,next){
    var city_id = req.query.city_id;
    if(!city_id){
        response.returnFalse(req, res, 'City is required', []);
    } else {
        let getOneCity = `SELECT * FROM city where id = ${city_id}`;
        console.log(getOneCity)
        let city_result = await executer.executeQuery([getOneCity])
        if (city_result[0].length > 0) {
            response.returnTrue(req, res, 'Success', city_result[0]);
        } else {
            response.returnFalse(req, res, 'Invalid City', []);
        }
    }
}


var deleteOneCity = async function(req,res,next){
    var city_id = req.query.city_id;
    if(!city_id){
        response.returnFalse(req, res, 'City is required', []);
    } else {
        let deleteOneCity = `DELETE FROM city where id = ${city_id}`;
        console.log(deleteOneCity)
        let city_result = await executer.executeQuery([deleteOneCity])
        console.log(city_result)
        if (city_result[0].affectedRows > 0) {
            response.returnTrue(req, res, 'City Deleted', city_result[0]);
        } else {
            response.returnFalse(req, res, 'Invalid City', []);
        }
    }
}

var updateOneCity = async function(req,res,next){
    var city = req.body.city;
    var price = req.body.price;
    var status = req.body.status;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var color = req.body.color;
    var city_id = req.body.city_id;
    if(!city){
        response.returnFalse(req, res, 'City is required', []);
    } else if(!price){
        response.returnFalse(req, res, 'price is required', []);
    } else if(!status){
        response.returnFalse(req, res, 'status is required', []);
    } else if(!start_date){
        response.returnFalse(req, res, 'start_date is required', []);
    } else if(!end_date){
        response.returnFalse(req, res, 'end_date is required', []);
    } else if(!color){
        response.returnFalse(req, res, 'color is required', []);
    } else {
        var updateCityQuery = `update city set city = '${city}',price = ${price}, status = '${status}',start_date = '${start_date}',end_date = '${end_date}',color = '${color}'  where id = ${city_id}` 
        console.log("updateCityQuery",updateCityQuery)
        let queryResult =  await executer.executeQuery([updateCityQuery]);
        if(queryResult[0].affectedRows > 0){
        response.returnTrue(req, res, 'City updated', queryResult[0]);
        }else{
        response.returnFalse(req, res, 'City cannot be updated', []);
        }
    }
}

var test = async function(req,res,next){
    res.send("heelo")
}



var login = {
    importData: importData,
    getData: getData,
    addCity:addCity,
    getOneCity : getOneCity,
    deleteOneCity : deleteOneCity,
    updateOneCity : updateOneCity,
    test : test
};

module.exports = login;