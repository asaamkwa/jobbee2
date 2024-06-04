const Express = require("express");


const app = Express();

//reqiure config env file
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const connectDabase =require("./config/database");
//setting up middleware
const errorMiddleware = require("./middlewares/errors");

//setting up errorHandler
const errorHandler = require("./utils/errorHandler");

//setting up bodyparse
app.use(Express.json());

//setting cookie parser
app.use(cookieParser());


//setting up config.env file variables
dotenv.config({path : "./config/config.env"});

//Handling Uncaught Exception
process.on("uncaughtException", err => {
     console.log(`ERROR: ${err.message}`);
     console.log("Shutting down the server due to uncaught exception");
     process.exit(1);
});


//connecting database
connectDabase();

//importing routes
const jobs = require("./routes/jobs");
const auth = require("./routes/auth");




//using imported routes
app.use("/api/v1", jobs);
app.use("/api/v1", auth);


//Handle unhandled routes, eg when a user type wrong url to search
app.all("*", (req, res, next) => {
    next(new errorHandler(`${req.originalUrl} route not found. Please you have type in a wrong URL!`, 404));
});

//Middleware to handle errors
app.use(errorMiddleware);




const PORT = process.env.PORT;

const server = app.listen(PORT, () =>{
    console.log(`Server started on port ${process.env.PORT}, on ${process.env.NODE_ENV} mode`);
});

//Handling Unhanadled Promise Relection
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log("Shitting down the server due to unhandled promise rejection.");
    server.close( () =>{
        process.exit(1);
    })
});


//example of uncaught exception
//console.log(fsahgjssssssssssssssssssssqkweoooooooooooooooqllll );