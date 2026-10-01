class PriorityQueue {
  constructor() {
    this.elements = [];
  }

  enqueue(element, priority) {
    this.elements.push({ element, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.elements.shift()?.element;
  }

  isEmpty() {
    return this.elements.length === 0;
  }
}

/**
 * Calculates geographic distance in meters between two lat/lng coordinates (Haversine formula).
 */
function calculateHaversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Admissible Heuristic Function h(n)
 */
function calculateHeuristic(nodeA, nodeB) {
  if (!nodeA || !nodeB || !nodeA.coordinates || !nodeB.coordinates) return 0;

  const outdoorDist = calculateHaversineDistance(
    nodeA.coordinates.lat, nodeA.coordinates.lng,
    nodeB.coordinates.lat, nodeB.coordinates.lng
  );

  const floorDifference = Math.abs((nodeA.coordinates.floor_z || 0) - (nodeB.coordinates.floor_z || 0));
  const floorPenaltyMeters = floorDifference * 10.0; // 10 meters estimate per floor level

  return outdoorDist + floorPenaltyMeters;
}

/**
 * Pure A* Pathfinding Algorithm Function
 *
 * @param {Graph} graph - Graph instance
 * @param {string} startNodeId - Start node ID
 * @param {string} goalNodeId - Destination node ID
 * @param {Object} options - { mode: 'SHORTEST' | 'ACCESSIBLE' }
 */
function findPath(graph, startNodeId, goalNodeId, options = { mode: 'SHORTEST' }) {
  if (!graph.hasNode(startNodeId)) {
    throw { code: 'INVALID_ORIGIN', message: `Origin node '${startNodeId}' does not exist` };
  }
  if (!graph.hasNode(goalNodeId)) {
    throw { code: 'INVALID_DESTINATION', message: `Destination node '${goalNodeId}' does not exist` };
  }
  if (startNodeId === goalNodeId) {
    const startNode = graph.getNode(startNodeId);
    return {
      mode: options.mode || 'SHORTEST',
      path: [startNode],
      edges: [],
      distance_meters: 0,
      estimated_time_minutes: 0
    };
  }

  const isAccessibleMode = options.mode === 'ACCESSIBLE';
  const startNode = graph.getNode(startNodeId);
  const goalNode = graph.getNode(goalNodeId);

  const frontier = new PriorityQueue();
  frontier.enqueue(startNodeId, 0);

  const cameFrom = new Map();
  const edgeUsed = new Map();
  const gScore = new Map();
  gScore.set(startNodeId, 0);

  const fScore = new Map();
  fScore.set(startNodeId, calculateHeuristic(startNode, goalNode));

  while (!frontier.isEmpty()) {
    const currentId = frontier.dequeue();

    if (currentId === goalNodeId) {
      // Reconstruct path
      const pathNodes = [];
      const pathEdges = [];
      let curr = goalNodeId;

      while (curr) {
        pathNodes.unshift(graph.getNode(curr));
        const edge = edgeUsed.get(curr);
        if (edge) pathEdges.unshift(edge);
        curr = cameFrom.get(curr);
      }

      const totalDistance = gScore.get(goalNodeId);
      // Average walking speed = 1.4 m/s (approx 84 m/min)
      const estimatedTimeMinutes = Math.ceil((totalDistance / 84) * 10) / 10;

      return {
        mode: options.mode,
        path: pathNodes,
        edges: pathEdges,
        distance_meters: Math.round(totalDistance * 10) / 10,
        estimated_time_minutes: estimatedTimeMinutes
      };
    }

    const currentG = gScore.get(currentId);
    const neighbors = graph.getNeighbors(currentId);

    for (const neighborEdge of neighbors) {
      // Accessibility Filtering Safety Rules
      if (isAccessibleMode) {
        if (neighborEdge.accessible === false || neighborEdge.has_stairs === true || neighborEdge.edge_type === 'stairs') {
          continue; // Skip inaccessible edges completely
        }
      }

      const neighborId = neighborEdge.target;
      const tentativenG = currentG + neighborEdge.distance_meters;

      if (!gScore.has(neighborId) || tentativenG < gScore.get(neighborId)) {
        cameFrom.set(neighborId, currentId);
        edgeUsed.set(neighborId, neighborEdge);
        gScore.set(neighborId, tentativenG);

        const h = calculateHeuristic(graph.getNode(neighborId), goalNode);
        const f = tentativenG + h;
        fScore.set(neighborId, f);
        frontier.enqueue(neighborId, f);
      }
    }
  }

  if (isAccessibleMode) {
    throw { code: 'NO_ACCESSIBLE_ROUTE', message: 'No step-free accessible route exists between selected locations' };
  } else {
    throw { code: 'NO_ROUTE_FOUND', message: 'No navigational path exists between selected locations' };
  }
}

module.exports = {
  findPath,
  calculateHeuristic,
  calculateHaversineDistance
};
