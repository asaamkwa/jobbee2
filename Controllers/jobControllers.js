const Job = require("../models/job");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");


//creating a method

//get all jobs =>  /api/v1/jobs
exports.getJobs = catchAsyncErrors( async(req, res, next) => {
    const jobs = await Job.find();
    res.status(200).json({
      success: true,
      results : jobs.length,
      data : jobs
    })
});

//create a new job  =>/api/v1/job/new
exports.newJob = catchAsyncErrors( async (req, res, next) => {

      //Addindg user to body
      req.body.user = req.user.id;
      //....................

      const job = await Job.create(req.body);

      res.status(200).json({
        sucess : true,
        message : "Job created succesfull.",
        data : job
      });
});


//update a job  =? /api/v1/job/:id
exports.updateJob =  catchAsyncErrors( async (req, res, next) => {
  let job = await Job.findById(req.params.id);

  if(!job) {

    return next(new ErrorHandler("Job not found by ErrorHandle message.", 404));
   
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new : true,
    runValidators :true,
    useFindAndModify : false
  });
  
  res.status(200).json({
    sucess : true,
    message : "Job is updated.",
    data : job
  });

});

//Delete a Job  =/api/v1/job/:id
exports.deleteJob = catchAsyncErrors( async (req, res, next) => {
  let job = await Job.findById(req.params.id);

  if(!job) {
    return next(new ErrorHandler("Job not found for deleting by ErrorHandle message.", 404));
  }

  job = await Job.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success : true,
    message : "Job is deleted successfully."
  });

});

//Get a single job with id and slug  => /api/v1/job/:id/:slug
exports.getJob = catchAsyncErrors( async (req, res, next) => {
  const job = await Job.find({$and: [{_id:req.params.id} , {slug: req.params.slug}]});

  if(!job || job.length ===0){
    return next(new ErrorHandler("Job not found ErrorHandle for id and slug of that job.", 404));
  }

  res.status(200).json({
    success : true,
    data : job
  })
});


//Get stats about a topic(job)  => /api/v1/stats/:topic
exports.jobStats = catchAsyncErrors( async (req, res, next) =>{
  const stats = await Job.aggregate([
    { 
      $match: {$text: {$search: "\""+req.params.topic + "\""}}
    },
    {
      $group: {
        _id: null,
        avgSalary: {$avg: "$salary"}
      }
    }
  ]);

  if(stats.length === 0){
     return next(new ErrorHandler(`No stats found for - ${req.params.topic}`, 200));
   
  }

  res.status(200).json({
    success : true,
    data : stats
  })
});


