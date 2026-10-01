class Graph {
  constructor() {
    this.nodes = new Map();
    this.adjacencyList = new Map();
  }

  addNode(node) {
    if (!node || !node.id) {
      throw new Error('Graph.addNode: Node must have an id');
    }
    this.nodes.set(node.id, node);
    if (!this.adjacencyList.has(node.id)) {
      this.adjacencyList.set(node.id, []);
    }
  }

  hasNode(id) {
    return this.nodes.has(id);
  }

  getNode(id) {
    return this.nodes.get(id);
  }

  addEdge(edge) {
    const { source, target, distance_meters, edge_type, accessible, has_stairs, is_bidirectional } = edge;

    if (!this.nodes.has(source) || !this.nodes.has(target)) {
      throw new Error(`Graph.addEdge: Source node ${source} or target node ${target} does not exist in graph`);
    }

    const forwardEdge = {
      id: edge.id,
      target,
      distance_meters: distance_meters || 1.0,
      edge_type: edge_type || 'corridor',
      accessible: accessible !== undefined ? accessible : true,
      has_stairs: has_stairs !== undefined ? has_stairs : false,
      verification_status: edge.verification_status || 'UNVERIFIED',
      data_status: edge.data_status || 'VERIFIED'
    };

    this.adjacencyList.get(source).push(forwardEdge);

    if (is_bidirectional !== false) {
      const backwardEdge = {
        id: `${edge.id}_rev`,
        target: source,
        distance_meters: distance_meters || 1.0,
        edge_type: edge_type || 'corridor',
        accessible: accessible !== undefined ? accessible : true,
        has_stairs: has_stairs !== undefined ? has_stairs : false,
        verification_status: edge.verification_status || 'UNVERIFIED',
        data_status: edge.data_status || 'VERIFIED'
      };
      this.adjacencyList.get(target).push(backwardEdge);
    }
  }

  getNeighbors(id) {
    return this.adjacencyList.get(id) || [];
  }

  getAllNodes() {
    return Array.from(this.nodes.values());
  }

  static buildFromRepository(repository) {
    const graph = new Graph();
    const nodes = repository.getNodes();
    const edges = repository.getEdges();

    nodes.forEach(node => graph.addNode(node));
    edges.forEach(edge => graph.addEdge(edge));

    return graph;
  }
}

module.exports = Graph;
