const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");

const jobSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true, "Please enter Job title" ],
        trim : true,
        maxlengh : [100, "Job title should not exceed 100 charaters"]
    },
    slug : String,
    description : {
        type : String,
        required : [true, "Please enter the Job description"],
        maxlengh : [1000, "Job description can not exceed 1000 charater"]

    },
    email : {
        type : String,
        validate : [validator.isEmail, "Please add a vaild email address"]

    },
    address : {
        type : String,
        required : [true, "Please add an address."]
    },
    company : {
        type : String,
        required : [true, "Please add company name."]
        
    },
    industry : {
        type : [String],
        required : [true, "please enter Industry for this job."],
        enum : {
            values : ["Business" , "Computer Science", "Banking", "Telecommunication"]
        },
        message : "Please select correct option for industry."

    },
    jobType : {
        type : String,
        required : [true, "please enter job type."],
        enum : {
            values :["Permanet" , "Temporary" , "Intership"],
            message : "Please select correct options for job type."
        }
    },
    minEducation : {
        type : String,
        required :[ true, "please enter minimum education for this job."],
        enum : {
            values : ["Bachelors" , "Masters" , "Phd"],
            message : "Please select correct option for min education." 
        }
    },
    position : {
        type : Number,
        default : 1
    },
    experince : {
        type : String,
        required : [true, "Please select correct option for experince."],
        enum : {
            values : ["No Experince" , "1 Year - 2 Years" , " 2 Years - 5Years" , "5 Years"],
            message : "Please select correct option for experince."
        }
    },
    salary : {
        type : Number,
        required : [true, "Please enter expected salary for this job."]
    },
    postingDate : {
        type : Date,
        default : Date.now
    },
    lastDate : {
        type : Date,
        default : new Date().setDate(new Date().getDate() + 7)
    },
    applicantApplied : {
        type : [Object],
        select : false
    }
});



//creating job slug before saving
jobSchema.pre("save", function(next){
    //creating slug before saving the DB
    this.slug = slugify(this.title, { lower : true});
    next();
});


module.exports = mongoose.model("Job", jobSchema);