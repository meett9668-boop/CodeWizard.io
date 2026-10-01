const Graph = require('../src/routing/graph/graph');
const { findPath } = require('../src/routing/astar/astar');
const { generateInstructions } = require('../src/routing/instructions/instruction.service');

describe('A* Pathfinding Algorithm & Instruction Tests', () => {
  let graph;

  beforeEach(() => {
    graph = new Graph();

    // Create synthetic test nodes
    graph.addNode({ id: 'A', name: 'Main Campus Gate', type: 'outdoor_gate', floor: 0, coordinates: { lat: 22.5, lng: 72.8, floor_z: 0 } });
    graph.addNode({ id: 'B_ent', name: 'Building Entrance', type: 'entrance', floor: 0, coordinates: { lat: 22.5005, lng: 72.8, floor_z: 0 } });
    graph.addNode({ id: 'B_stairs', name: 'Stairs Ground', type: 'stairs', floor: 0, coordinates: { lat: 22.501, lng: 72.8, floor_z: 0 } });
    graph.addNode({ id: 'B_elevator', name: 'Elevator Ground', type: 'elevator', floor: 0, coordinates: { lat: 22.502, lng: 72.8, floor_z: 0 } });
    graph.addNode({ id: 'C_elevator', name: 'Elevator Floor 1', type: 'elevator', floor: 1, coordinates: { lat: 22.502, lng: 72.8, floor_z: 1 } });
    graph.addNode({ id: 'C_room', name: 'Room 101', type: 'room', floor: 1, coordinates: { lat: 22.503, lng: 72.8, floor_z: 1 } });
    graph.addNode({ id: 'D_isolated', name: 'Node D Isolated', type: 'room', floor: 0, coordinates: { lat: 22.6, lng: 72.9, floor_z: 0 } });

    // Outdoor path
    graph.addEdge({ id: 'e1', source: 'A', target: 'B_ent', distance_meters: 50, accessible: true, has_stairs: false, edge_type: 'outdoor_path' });
    // Entrance
    graph.addEdge({ id: 'e2', source: 'B_ent', target: 'B_stairs', distance_meters: 10, accessible: false, has_stairs: true, edge_type: 'stairs' });
    graph.addEdge({ id: 'e3', source: 'B_ent', target: 'B_elevator', distance_meters: 15, accessible: true, has_stairs: false, edge_type: 'corridor' });
    // Elevator vertical connection
    graph.addEdge({ id: 'e4', source: 'B_elevator', target: 'C_elevator', distance_meters: 10, accessible: true, has_stairs: false, edge_type: 'elevator' });
    // Corridor to room
    graph.addEdge({ id: 'e5', source: 'C_elevator', target: 'C_room', distance_meters: 20, accessible: true, has_stairs: false, edge_type: 'corridor' });
  });

  test('Shortest vs Accessible route', () => {
    const shortest = findPath(graph, 'A', 'C_room', { mode: 'SHORTEST' });
    const accessible = findPath(graph, 'A', 'C_room', { mode: 'ACCESSIBLE' });

    expect(accessible.path.map(n => n.id)).toEqual(['A', 'B_ent', 'B_elevator', 'C_elevator', 'C_room']);
    expect(accessible.edges.every(e => e.has_stairs === false)).toBe(true);
  });

  test('Generates distinct instruction types for outdoor path, elevator, corridor, and arrival', () => {
    const route = findPath(graph, 'A', 'C_room', { mode: 'ACCESSIBLE' });
    const { instructions } = generateInstructions(route.path, route.edges);

    expect(instructions.some(i => i.includes('outdoor path'))).toBe(true);
    expect(instructions.some(i => i.includes('elevator'))).toBe(true);
    expect(instructions.some(i => i.includes('corridor'))).toBe(true);
    expect(instructions.some(i => i.includes('arrived at Room 101'))).toBe(true);
  });

  test('Throws NO_ACCESSIBLE_ROUTE for disconnected node', () => {
    expect(() => findPath(graph, 'A', 'D_isolated', { mode: 'ACCESSIBLE' })).toThrow();
  });
});
