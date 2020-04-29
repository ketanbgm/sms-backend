const executer = require('../helpers/mysqlExecuter')
const response = require("../helpers/response")
const moment = require('moment');
const fs = require('fs');
path = require('path'),
    filePath = path.join(__dirname, 'data.json');

var getData = async function(req, res, next) {
    let numRows;
    let numPerPage = parseInt(req.query.npp, 10) || 10;
    let page = parseInt(req.query.page, 10) || 1;
    let start_date_from = req.query.start_date_from;
    let start_date_to = req.query.end_date_to;
    let end_date_from = req.query.end_date_from;
    let end_date_to = req.query.end_date_to;

    let numPages;
    page = page - 1;
    let skip = page * numPerPage;
    var limit = skip + ',' + numPerPage;
    var whereClause = '';
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
        let getCities = `SELECT * FROM city where 1 ${whereClause}  LIMIT ${limit}`;
        let reportResult = await executer.executeQuery([getCities])

        console.log("reportResult", reportResult)
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




var login = {
    importData: importData,
    getData: getData
};

module.exports = login;