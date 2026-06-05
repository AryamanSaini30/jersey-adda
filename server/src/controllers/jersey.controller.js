const { successResponse } = require('../utils/apiResponse');
const jerseyService = require('../services/jersey.service');

async function listJerseys(req, res, next) {
  try {
    const result = await jerseyService.listJerseys(req.query);
    return res.status(200).json(successResponse(result));
  } catch (error) {
    next(error);
  }
}

async function getJerseyBySlug(req, res, next) {
  try {
    const jersey = await jerseyService.getJerseyBySlug(req.params.slug);
    return res.status(200).json(successResponse(jersey));
  } catch (error) {
    next(error);
  }
}

async function createJersey(req, res, next) {
  try {
    const jersey = await jerseyService.createJersey(req.body, req.files);
    return res.status(201).json(successResponse(jersey, 'Jersey created'));
  } catch (error) {
    next(error);
  }
}

async function updateJersey(req, res, next) {
  try {
    const jersey = await jerseyService.updateJersey(req.params.id, req.body, req.files);
    return res.status(200).json(successResponse(jersey, 'Jersey updated'));
  } catch (error) {
    next(error);
  }
}

async function deleteJersey(req, res, next) {
  try {
    const result = await jerseyService.deleteJersey(req.params.id);
    return res.status(200).json(successResponse(result, 'Jersey deleted'));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listJerseys,
  getJerseyBySlug,
  createJersey,
  updateJersey,
  deleteJersey
};