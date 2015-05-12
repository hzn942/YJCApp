var Job = Parse.Object.extend('Job');


// get all jobs
exports.all = function(callback){
	var query = new Parse.Query(Job);
	query.find(callback);
};

// create new job
exports.create = function(req, callback){
  var job = new Job();
  var jobErrors = {};
  var numErrors = 0;
  // check null
  if (req.body.jobTitle === '' || req.body.jobTitle === null || req.body.jobTitle === undefined){
    jobErrors.jobTitle = 'Invalid Job Title';
    numErrors++;
  }
  if (!req.body.company)
    jobErrors.company = 'Invalid Company';

  if (numErrors > 0)
    res.render('jobs/index', {username: 'sysadmin', errors: jobErrors});


  // if (req.body.text1 === "") {
  //   res.status(403).send('Top text cannot be blank');
  // }

  // Set metadata fields
  job.set('jobTitle', req.body.jobTitle);
  job.set('company', req.body.company);
  job.set('salary', req.body.salary);
  job.set('address', String(req.body.address));
  job.set('zipcode', parseInt(req.body.zipcode) || 0);
  job.set('educationRequirement', String(req.body.educationRequirement));
  job.set('numOpenings', parseInt(req.body.numOpenings) || 0);
  job.set('workSchedule', req.body.workSchedule);
  job.set('startDate', new Date(req.body.startDate));
  job.set('hoursPerWeek', parseFloat(req.body.hoursPerWeek) || 0.0);
  job.set('fullTime', req.body.fullTime);
  job.set('jobDescription', req.body.jobDescription);
  //job.set('qualifications', req.body.qualifications);
  job.set('contact', req.body.contact); 
  job.set('Comment', req.body.Comment);
  
  // // Jobs are read only
  // var acl = new Parse.ACL();
  // acl.setPublicReadAccess(true);
  // job.setACL(acl);
  
  // no errors
  jobErrors = {
    jobTitle: ''
  };
  job.save(null, callback);
};