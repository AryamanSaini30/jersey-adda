const asyncHandler = require('../middleware/asyncHandler');
const { settingsService } = require('../services/settings.service');
const { ApiResponse } = require('../utils/apiResponse');

const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getSettings();
  res.status(200).json(new ApiResponse(200, settings));
});

const updateSettings = asyncHandler(async (req, res) => {
  const updatedSettings = await settingsService.updateSettings(req.body);
  res.status(200).json(new ApiResponse(200, updatedSettings, 'Settings updated successfully'));
});

const settingsController = {
  getSettings,
  updateSettings,
};

module.exports = { settingsController };
