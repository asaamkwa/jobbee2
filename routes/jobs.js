const express = require("express");

const router = express.Router();



//Importing jobs controllers methods
const {
     getJobs, 
     newJob, 
     updateJob, 
     deleteJob,
     getJob,
     jobStats 
    } = require("../Controllers/jobControllers");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

//type of require you want e.g => get, post, update, delete etc
router.route("/jobs").get(getJobs);

router.route("/job/new").post( isAuthenticatedUser, authorizeRoles('employeer', 'admin'), newJob);

router.route("/job/:id")
      .put(isAuthenticatedUser, updateJob)
      .delete(isAuthenticatedUser, deleteJob);
router.route("/job/:id/:slug").get(getJob);
router.route("/stats/:topic").get(jobStats);


module.exports= router;