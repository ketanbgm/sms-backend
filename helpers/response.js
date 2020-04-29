var returnTrue = function (req, res, message, arr){

    return res.status(200).json(
            {
                "result": {
                    success: true,
                    message: message
                },
                "data": arr
            }
    );
};

var returnFalse = function (req, res, message, arr){

    return res.status(200).json(
        {
            "result": {
                success: false,
                message: message
            },
            "data": arr
        }
    );
};

var response = {
    returnTrue: returnTrue,
    returnFalse: returnFalse
};

module.exports = response;