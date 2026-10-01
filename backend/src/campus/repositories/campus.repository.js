const fs = require('fs');
const path = require('path');

class CampusRepository {
  constructor(dataDir = path.join(__dirname, '../data/charusat')) {
    this.dataDir = dataDir;
    this.campus = null;
    this.buildings = [];
    this.nodes = [];
    this.edges = [];
    this.destinations = [];
    this.demoNodes = [];
    this.demoEdges = [];
    this._loadData();
  }

  _loadData() {
    try {
      this.campus = JSON.parse(fs.readFileSync(path.join(this.dataDir, 'campus.json'), 'utf8'));
      this.buildings = JSON.parse(fs.readFileSync(path.join(this.dataDir, 'buildings.json'), 'utf8'));
      this.nodes = JSON.parse(fs.readFileSync(path.join(this.dataDir, 'nodes.json'), 'utf8'));
      this.edges = JSON.parse(fs.readFileSync(path.join(this.dataDir, 'edges.json'), 'utf8'));

      if (fs.existsSync(path.join(this.dataDir, 'destinations.json'))) {
        this.destinations = JSON.parse(fs.readFileSync(path.join(this.dataDir, 'destinations.json'), 'utf8'));
      }
      if (fs.existsSync(path.join(this.dataDir, 'demo_destinations.json'))) {
        this.demoNodes = JSON.parse(fs.readFileSync(path.join(this.dataDir, 'demo_destinations.json'), 'utf8'));
      }
      if (fs.existsSync(path.join(this.dataDir, 'demo_edges.json'))) {
        this.demoEdges = JSON.parse(fs.readFileSync(path.join(this.dataDir, 'demo_edges.json'), 'utf8'));
      }
    } catch (err) {
      console.error('[CampusRepository] Error loading JSON data:', err.message);
    }
  }

  getCampus() {
    return this.campus;
  }

  getBuildings() {
    return this.buildings;
  }

  getBuildingById(id) {
    return this.buildings.find(b => b.id === id || b.code.toLowerCase() === id.toLowerCase());
  }

  getNodes() {
    return [...this.nodes, ...this.demoNodes];
  }

  getNodeById(id) {
    return this.getNodes().find(n => n.id === id);
  }

  getEdges() {
    return [...this.edges, ...this.demoEdges];
  }

  getDestinations() {
    return this.destinations;
  }

  searchLocations(query) {
    if (!query || typeof query !== 'string') return [];
    const q = query.trim().toLowerCase();

    // 1. Search in Catalog Destinations first
    const catalogMatches = this.destinations.filter(d => {
      const matchName = d.name.toLowerCase().includes(q) || d.full_name.toLowerCase().includes(q);
      const matchRoom = d.room_number ? d.room_number.toLowerCase().includes(q) || `room ${d.room_number.toLowerCase()}`.includes(q) : false;
      const matchBuilding = d.building_code.toLowerCase().includes(q);
      const matchType = d.type.toLowerCase().includes(q);
      const matchAliases = d.aliases ? d.aliases.some(a => a.toLowerCase().includes(q)) : false;
      return matchName || matchRoom || matchBuilding || matchType || matchAliases;
    }).map(d => {
      const building = this.getBuildingById(d.building_id || d.building_code);
      const linkedNode = d.graph_node_id ? this.getNodeById(d.graph_node_id) : null;
      return {
        id: d.id,
        node_id: d.graph_node_id,
        name: d.full_name || d.name,
        display_name: d.full_name || d.name,
        room_number: d.room_number,
        building_code: d.building_code,
        building_name: building ? building.name : d.building_code,
        floor: d.floor,
        type: d.type,
        verification_status: d.source_status,
        data_status: d.data_status || 'VERIFIED',
        is_navigable: !!linkedNode
      };
    });

    // 2. Search in Graph Nodes (including entrance gates, junctions, elevators, stairs)
    const nodeMatches = this.getNodes().filter(node => {
      const matchName = node.name.toLowerCase().includes(q);
      const matchId = node.id.toLowerCase().includes(q);
      const matchType = node.type.toLowerCase().includes(q);
      const building = node.building_id ? this.getBuildingById(node.building_id) : null;
      const matchBuilding = building && (building.name.toLowerCase().includes(q) || building.code.toLowerCase().includes(q));

      // Exclude if already matched in catalog to avoid duplicates
      const alreadyInCatalog = catalogMatches.some(c => c.node_id === node.id);

      return (matchName || matchId || matchType || matchBuilding) && !alreadyInCatalog;
    }).map(node => {
      const building = node.building_id ? this.getBuildingById(node.building_id) : null;
      return {
        id: node.id,
        node_id: node.id,
        name: node.name,
        display_name: node.name,
        room_number: null,
        building_code: building ? building.code : null,
        building_name: building ? building.name : null,
        floor: node.floor,
        type: node.type,
        verification_status: node.verification_status || 'UNVERIFIED',
        data_status: node.data_status || 'VERIFIED',
        is_navigable: true
      };
    });

    return [...catalogMatches, ...nodeMatches];
  }
}

module.exports = CampusRepository;
