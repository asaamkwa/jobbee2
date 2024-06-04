

const mongoose = require("mongoose");

const connectDabase = () => {mongoose.connect(process.env.DB_LOCAL_URL).then(con =>{
    console.log(`MangoDb Database connected with host: ${con.connection.host}`)}
)};

module.exports = connectDabase;