const Job = require('../models/Job');
const {BadRequestError, UnauthenticatedError, NotFoundError} = require('../errors')
const {StatusCodes} = require('http-status-codes');

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy: req.user.userId})
    res.status(StatusCodes.OK).json({jobs, count: jobs.length});
}

const getJob = async (req, res) => {
    res.send("Get Job");
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job});
}

const updateJob = async (req, res) => {
    const {body: {company, position}, params: {id:jobId}, user: {userId}} =req;
    if(company === '' || position === '') {
        throw new BadRequestError(`Company or position fields cannot tbe empty`)
    }

    const job = await Job.findOneAndUpdate({_id: jobId, createdBy: userId}, req.body, {new: true, runValidators: true})

    if(!job) {
        throw new NotFoundError(`No job with id: ${jobId}`);
    }
    res.status(StatusCodes.OK).json({job});
}

const deleteJob = async (req, res) => {
    const {params: {id: jobId}, user: {userId}} = req;

    const job = await Job.findOneAndRemove({_id: jobId, createdBy: userId});

    if(!job) {
        throw new NotFoundError(`No job with id: ${jobId}`)
    }
    res.status(StatusCodes.OK).send();
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}