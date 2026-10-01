const campusService = require('../services/campus.service');

exports.getCampus = (req, res, next) => {
  try {
    const campus = campusService.getCampusInfo();
    res.json({ success: true, campus });
  } catch (err) {
    next(err);
  }
};

exports.getBuildings = (req, res, next) => {
  try {
    const buildings = campusService.getBuildings();
    res.json({ success: true, buildings });
  } catch (err) {
    next(err);
  }
};

exports.getBuildingById = (req, res, next) => {
  try {
    const building = campusService.getBuildingById(req.params.id);
    res.json({ success: true, building });
  } catch (err) {
    next(err);
  }
};

exports.searchLocations = (req, res, next) => {
  try {
    const query = req.query.q || '';
    const results = campusService.searchLocations(query);
    res.json({ success: true, count: results.length, locations: results });
  } catch (err) {
    next(err);
  }
};

exports.getLocationById = (req, res, next) => {
  try {
    const location = campusService.getLocationById(req.params.id);
    res.json({ success: true, location });
  } catch (err) {
    next(err);
  }
};

exports.getNearestLocation = (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_COORDINATES', message: 'Valid lat and lng query parameters are required' }
      });
    }

    const result = campusService.getNearestLocation(lat, lng);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

exports.calculateRoute = (req, res, next) => {
  try {
    const { from, to, mode } = req.body;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: { code: 'MALFORMED_REQUEST', message: "Request body must include 'from' and 'to' node IDs" }
      });
    }

    const route = campusService.calculateRoute(from, to, mode);
    res.json({ success: true, route });
  } catch (err) {
    if (err.code) {
      const statusCode = err.code === 'NOT_FOUND' ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        error: { code: err.code, message: err.message }
      });
    }
    next(err);
  }
};

exports.reportIssue = (req, res, next) => {
  try {
    const { category, building, location, description } = req.body;
    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Description is required to submit an issue report.' }
      });
    }

    const issueReport = campusService.saveIssueReport({ category, building, location, description });
    res.json({ success: true, message: 'Issue reported successfully', issue: issueReport });
  } catch (err) {
    next(err);
  }
};
