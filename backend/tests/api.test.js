const request = require('supertest');
const app = require('../src/server');

describe('Campus Navigator Backend Comprehensive API Integration Tests', () => {

  test('1. GET /health and GET /api/health return status ok', async () => {
    const res1 = await request(app).get('/health');
    expect(res1.statusCode).toBe(200);
    expect(res1.body.status).toBe('ok');

    const res2 = await request(app).get('/api/health');
    expect(res2.statusCode).toBe(200);
    expect(res2.body.success).toBe(true);
  });

  test('2 & 3. GET /api/campuses/charusat and buildings return A5, A6, and A7', async () => {
    const res = await request(app).get('/api/campuses/charusat/buildings');
    expect(res.statusCode).toBe(200);
    expect(res.body.buildings.length).toBe(3);
    const codes = res.body.buildings.map(b => b.code);
    expect(codes).toContain('A5');
    expect(codes).toContain('A6');
    expect(codes).toContain('A7');
  });

  test('4 & 5. Destination search across room numbers and names', async () => {
    const res1 = await request(app).get('/api/locations/search?q=638');
    expect(res1.statusCode).toBe(200);
    expect(res1.body.locations.length).toBeGreaterThan(0);
    expect(res1.body.locations[0].room_number).toBe('638');

    const res2 = await request(app).get('/api/locations/search?q=DBMS');
    expect(res2.statusCode).toBe(200);
    expect(res2.body.locations.length).toBeGreaterThan(0);
    expect(res2.body.locations[0].name).toContain('Database');
  });

  test('6. POST /api/routes calculates Shortest route with polyline and metadata', async () => {
    const res = await request(app)
      .post('/api/routes')
      .send({
        from: 'node_ext_main_gate',
        to: 'node_a7_f2_r638',
        mode: 'SHORTEST'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.route.mode).toBe('SHORTEST');
    expect(res.body.route.distance_meters).toBeGreaterThan(0);
    expect(res.body.route.instructions.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body.route.polyline_coordinates)).toBe(true);
    expect(res.body.route.origin.id).toBe('node_ext_main_gate');
    expect(res.body.route.destination.id).toBe('node_a7_f2_r638');
    expect(res.body.route.data_quality).toBeDefined();
  });

  test('7, 8 & 9. POST /api/routes calculates Accessible route avoiding stairs & using elevator', async () => {
    const res = await request(app)
      .post('/api/routes')
      .send({
        from: 'node_ext_main_gate',
        to: 'node_a7_f2_r638',
        mode: 'ACCESSIBLE'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.route.mode).toBe('ACCESSIBLE');
    const hasStairs = res.body.route.edges.some(e => e.has_stairs === true || e.edge_type === 'stairs');
    expect(hasStairs).toBe(false);

    expect(res.body.route.floor_transitions.length).toBeGreaterThan(0);
    expect(res.body.route.floor_transitions[0].transition_type).toBe('elevator');
    expect(res.body.route.instructions.some(i => i.includes('elevator'))).toBe(true);
  });

  test('10, 11 & 12. Polyline ordering, instructions, and floor transitions', async () => {
    const res = await request(app)
      .post('/api/routes')
      .send({
        from: 'node_ext_a5_entrance',
        to: 'dest_a5_r501',
        mode: 'SHORTEST'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.route.polyline_coordinates.length).toBe(res.body.route.nodes.length);
    expect(res.body.route.instructions.length).toBeGreaterThan(0);
  });

  test('14, 15, 16 & 17. Error handling for invalid origin, destination, and modes', async () => {
    const res1 = await request(app)
      .post('/api/routes')
      .send({ from: 'invalid_node', to: 'node_a7_f2_r638', mode: 'SHORTEST' });
    expect(res1.statusCode).toBe(400);
    expect(res1.body.error.code).toBe('INVALID_ORIGIN');

    const res2 = await request(app)
      .post('/api/routes')
      .send({ from: 'node_ext_main_gate', to: 'invalid_node', mode: 'SHORTEST' });
    expect(res2.statusCode).toBe(400);
    expect(res2.body.error.code).toBe('INVALID_DESTINATION');
  });

  test('18. GET /api/locations/nearest resolves GPS coordinates to nearest node & building', async () => {
    const res = await request(app).get('/api/locations/nearest?lat=22.5996&lng=72.8206');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.nearest_node.id).toBe('node_ext_a6_entrance');
    expect(res.body.building.code).toBe('A6');
    expect(res.body.distance_meters).toBeLessThan(10);
  });

  test('19, 20 & 21. Demo-only destination route routing and data quality metadata', async () => {
    const res = await request(app)
      .post('/api/routes')
      .send({
        from: 'node_ext_main_gate',
        to: 'dest_a7_r635', // Room 635 - Demo-only node
        mode: 'ACCESSIBLE'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.route.data_quality.is_demo_route).toBe(true);
    expect(res.body.route.data_quality.demo_segments).toBeGreaterThan(0);
  });
});
