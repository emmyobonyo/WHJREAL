const Job = require('./jobs.mongo');

const DEFAULT_JOB_ID = 1;

async function getLatestJobId() {
  const latestJobId = await Job.findOne({}).sort('-jobId');
  if (!latestJobId) {
    return DEFAULT_JOB_ID;
  }

  return latestJobId.jobId;
}

async function saveNewJob(newJob) {
  await Job.findOneAndUpdate(
    {
      jobId: newJob.jobId,
    },
    newJob,
    {
      upsert: true,
    }
  );
}

async function createNewJob(job) {
  const newJobId = (await getLatestJobId()) + 1;
  const newJob = Object.assign(job, {
    jobId: newJobId,
    deleted: false,
    datePosted: new Date(),
  });

  await saveNewJob(newJob);
}

module.exports = {
  createNewJob,
};
