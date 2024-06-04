const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) =>{
    err.statusCode = err.statusCode || 500;

    if(process.env.NODE_ENV === "development") {
        res.status(err.statusCode).json({
            success : false,
            error : err,
            errMessage : err.message,
            stack : err.stack
            
        });
    }

    if(process.env.NODE_ENV === "production") {
        let error = {...err};

        error.message = err.message;

        //Wrong Mongoose Object ID Error, eg: when you type wrong id number to updat jobs
        if(err.name === "CastError") {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new ErrorHandler(message, 404);
        }

        //Handleing Mongoose Validation Error. eg two or more fields require error
        if(err.name === "ValidationError"){
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400);
        }

        if(err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
            error = new ErrorHandler(message, 400);
        }




        res.status(error.statusCode).json({
            success : false,
            message : error.message || "Internal Srever Error."
        });

    }
}