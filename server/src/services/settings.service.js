const Settings = require('../models/settings.model');

const getSettings = async () => {
  return Settings.get();
};

const updateSettings = async (newSettings) => {
  return Settings.update(newSettings);
};

const settingsService = {
  getSettings,
  updateSettings,
};

module.exports = { settingsService };
