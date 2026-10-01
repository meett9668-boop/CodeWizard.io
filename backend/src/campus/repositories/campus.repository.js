const fs = require('fs');
const path = require('path');

class CampusRepository {
  constructor(dataDir = path.join(__dirname, '../data/charusat')) {
    this.dataDir = dataDir;
    this.campus = null;
    this.buildings = [];
    this.nodes = [];
    this.edges = [];
    this._loadData();
  }

  _loadData() {
    try {
      this.campus = JSON.parse(fs.readFileSync(path.join(this.dataDir, 'campus.json'), 'utf8'));
      this.buildings = JSON.parse(fs.readFileSync(path.join(this.dataDir, 'buildings.json'), 'utf8'));
      this.nodes = JSON.parse(fs.readFileSync(path.join(this.dataDir, 'nodes.json'), 'utf8'));
      this.edges = JSON.parse(fs.readFileSync(path.join(this.dataDir, 'edges.json'), 'utf8'));
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
    return this.nodes;
  }

  getNodeById(id) {
    return this.nodes.find(n => n.id === id);
  }

  getEdges() {
    return this.edges;
  }

  searchLocations(query) {
    if (!query || typeof query !== 'string') return [];
    const q = query.trim().toLowerCase();

    return this.nodes.filter(node => {
      const matchName = node.name.toLowerCase().includes(q);
      const matchId = node.id.toLowerCase().includes(q);
      const matchType = node.type.toLowerCase().includes(q);
      const building = node.building_id ? this.getBuildingById(node.building_id) : null;
      const matchBuilding = building && (building.name.toLowerCase().includes(q) || building.code.toLowerCase().includes(q));

      return matchName || matchId || matchType || matchBuilding;
    }).map(node => {
      const building = node.building_id ? this.getBuildingById(node.building_id) : null;
      return {
        ...node,
        building_name: building ? building.name : null,
        building_code: building ? building.code : null
      };
    });
  }
}

module.exports = CampusRepository;
