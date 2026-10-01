const CampusRepository = require('../campus/repositories/campus.repository');
const Graph = require('../routing/graph/graph');
const { findPath, calculateHaversineDistance } = require('../routing/astar/astar');
const { generateInstructions } = require('../routing/instructions/instruction.service');

class CampusService {
  constructor() {
    this.repository = new CampusRepository();
    this.graph = Graph.buildFromRepository(this.repository);
  }

  getCampusInfo() {
    return this.repository.getCampus();
  }

  getBuildings() {
    return this.repository.getBuildings();
  }

  getBuildingById(id) {
    const building = this.repository.getBuildingById(id);
    if (!building) {
      throw { code: 'NOT_FOUND', message: `Building with ID or Code '${id}' not found` };
    }
    return building;
  }

  searchLocations(query) {
    return this.repository.searchLocations(query);
  }

  getLocationById(id) {
    const node = this.repository.getNodeById(id);
    if (!node) {
      throw { code: 'NOT_FOUND', message: `Location node '${id}' not found` };
    }
    const building = node.building_id ? this.repository.getBuildingById(node.building_id) : null;
    return {
      ...node,
      building_name: building ? building.name : null,
      building_code: building ? building.code : null
    };
  }

  getNearestLocation(lat, lng) {
    const nodes = this.repository.getNodes();
    if (nodes.length === 0) {
      throw { code: 'NOT_FOUND', message: 'No campus locations loaded' };
    }

    let nearestNode = null;
    let minDistance = Infinity;

    for (const node of nodes) {
      if (node.coordinates && node.coordinates.lat !== undefined && node.coordinates.lng !== undefined) {
        const dist = calculateHaversineDistance(lat, lng, node.coordinates.lat, node.coordinates.lng);
        if (dist < minDistance) {
          minDistance = dist;
          nearestNode = node;
        }
      }
    }

    return {
      nearest_node: nearestNode,
      distance_meters: Math.round(minDistance * 10) / 10
    };
  }

  calculateRoute(fromNodeId, toNodeId, mode = 'SHORTEST') {
    const upperMode = (mode || 'SHORTEST').toUpperCase();
    if (upperMode !== 'SHORTEST' && upperMode !== 'ACCESSIBLE') {
      throw { code: 'INVALID_ROUTE_MODE', message: `Route mode '${mode}' is invalid. Supported modes: 'SHORTEST', 'ACCESSIBLE'` };
    }

    const routeResult = findPath(this.graph, fromNodeId, toNodeId, { mode: upperMode });
    const { instructions, floor_transitions } = generateInstructions(routeResult.path, routeResult.edges);

    // Extract polyline coordinates directly from path nodes in order
    const polyline_coordinates = routeResult.path
      .filter(node => node.coordinates && node.coordinates.lat !== undefined && node.coordinates.lng !== undefined)
      .map(node => [node.coordinates.lat, node.coordinates.lng]);

    return {
      mode: routeResult.mode,
      distance_meters: routeResult.distance_meters,
      estimated_time_minutes: routeResult.estimated_time_minutes,
      polyline_coordinates,
      nodes: routeResult.path,
      edges: routeResult.edges,
      floor_transitions,
      instructions
    };
  }
}

module.exports = new CampusService();
