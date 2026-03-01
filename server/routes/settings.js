const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { validateSettings } = require('../middleware/validators');

router.route('/')
  .get(getSettings)
  .put(validateSettings, updateSettings);

module.exports = router;
