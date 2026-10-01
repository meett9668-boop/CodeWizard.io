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
    // Resolve if destination ID or node ID
    let node = this.repository.getNodeById(id);
    if (!node) {
      const dest = this.repository.getDestinations().find(d => d.id === id);
      if (dest && dest.graph_node_id) {
        node = this.repository.getNodeById(dest.graph_node_id);
      }
    }
    if (!node) {
      throw { code: 'NOT_FOUND', message: `Location node or destination '${id}' not found` };
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

    const building = nearestNode && nearestNode.building_id ? this.repository.getBuildingById(nearestNode.building_id) : null;

    return {
      nearest_node: nearestNode,
      building: building ? { id: building.id, code: building.code, name: building.name } : null,
      floor: nearestNode ? nearestNode.floor : null,
      distance_meters: Math.round(minDistance * 10) / 10
    };
  }

  _resolveNodeId(idOrDestinationId) {
    if (this.graph.hasNode(idOrDestinationId)) {
      return idOrDestinationId;
    }
    const dest = this.repository.getDestinations().find(d => d.id === idOrDestinationId);
    if (dest && dest.graph_node_id && this.graph.hasNode(dest.graph_node_id)) {
      return dest.graph_node_id;
    }
    return idOrDestinationId;
  }

  calculateRoute(fromInput, toInput, mode = 'SHORTEST') {
    const fromNodeId = this._resolveNodeId(fromInput);
    const toNodeId = this._resolveNodeId(toInput);

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

    // Compute data quality metrics (verified vs unverified vs demo segments)
    let verified_segments = 0;
    let unverified_segments = 0;
    let demo_segments = 0;

    routeResult.edges.forEach(e => {
      if (e.data_status === 'DEMO_ONLY') {
        demo_segments++;
      } else if (e.verification_status === 'VERIFIED') {
        verified_segments++;
      } else {
        unverified_segments++;
      }
    });

    const is_demo_route = demo_segments > 0;
    const originNode = routeResult.path[0];
    const destinationNode = routeResult.path[routeResult.path.length - 1];

    return {
      mode: routeResult.mode,
      distance_meters: routeResult.distance_meters,
      estimated_time_minutes: routeResult.estimated_time_minutes,
      polyline_coordinates,
      origin: {
        id: originNode.id,
        name: originNode.name,
        building_id: originNode.building_id,
        floor: originNode.floor
      },
      destination: {
        id: destinationNode.id,
        name: destinationNode.name,
        building_id: destinationNode.building_id,
        floor: destinationNode.floor
      },
      data_quality: {
        verified_segments,
        unverified_segments,
        demo_segments,
        is_demo_route
      },
      nodes: routeResult.path,
      edges: routeResult.edges,
      floor_transitions,
      instructions
    };
  }
}

module.exports = new CampusService();
