const express = require('express');
const router = express.Router();
const campusController = require('../controllers/campus.controller');

// Campus & Building routes
router.get('/campuses/charusat', campusController.getCampus);
router.get('/campuses/charusat/buildings', campusController.getBuildings);
router.get('/buildings/:id', campusController.getBuildingById);

// Location & Search routes
router.get('/locations/search', campusController.searchLocations);
router.get('/locations/nearest', campusController.getNearestLocation);
router.get('/locations/:id', campusController.getLocationById);

// Route calculation endpoint
router.post('/routes', campusController.calculateRoute);

// Issue reporting endpoint
router.post('/issues', campusController.reportIssue);

module.exports = router;
