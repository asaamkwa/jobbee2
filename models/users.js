const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");



const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please enter your name"]
    },
    email : {
        type : String,
        required : [true, "Please enter your address"],
        unique : true,
        validate : [validator.isEmail, "Please enter valid email address"]
    },
    role : {
        type : String,
        enum : {
            values : ["user", "employeer"],
            message : "Please select correct role"
        },
        default : "user"
    },
    password : {
        type : String,
        required : [true, "Please enter password for your account"],
        minlength : [8, "Your password must be at least 8 characters"],
        select : false
    },
    createAt : {
        type : Date,
        default : Date.now
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date
});

//Encrypting password before saving
userSchema.pre("save", async function(next) {

    if(!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)

});


//Return JSON Web Token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id : this._id}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_TIME 
    })
};

//compare user password in database password
userSchema.methods.comparedPassword = async function(enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
};



//Generate Password Reset Token
userSchema.methods.getResetPasswordToken = function() {
    //Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");


    //Hash ans set to resetpasswordtoken
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    //setTokenExpireTime
    this.resetPasswordExpire = Date.now() + 30*60*1000;
    return resetToken;
}

module.exports = mongoose.model("User", userSchema);