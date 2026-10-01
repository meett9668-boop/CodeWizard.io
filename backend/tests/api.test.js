const request = require('supertest');
const app = require('../src/server');

describe('Campus Navigator Backend API Integration Tests', () => {

  test('GET /health returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /api/campuses/charusat returns CHARUSAT campus info', async () => {
    const res = await request(app).get('/api/campuses/charusat');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.campus.code).toBe('CHARUSAT');
  });

  test('GET /api/campuses/charusat/buildings returns A5, A6, and A7', async () => {
    const res = await request(app).get('/api/campuses/charusat/buildings');
    expect(res.statusCode).toBe(200);
    expect(res.body.buildings.length).toBe(3);
    const codes = res.body.buildings.map(b => b.code);
    expect(codes).toContain('A5');
    expect(codes).toContain('A6');
    expect(codes).toContain('A7');
  });

  test('GET /api/locations/search?q=638 returns Room 638', async () => {
    const res = await request(app).get('/api/locations/search?q=638');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.locations.length).toBeGreaterThan(0);
    expect(res.body.locations[0].id).toBe('node_a7_f2_r638');
  });

  test('POST /api/routes calculates Shortest route with polyline_coordinates and instructions', async () => {
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

    // Polyline coordinates verification
    expect(Array.isArray(res.body.route.polyline_coordinates)).toBe(true);
    expect(res.body.route.polyline_coordinates.length).toBe(res.body.route.nodes.length);
    expect(res.body.route.polyline_coordinates[0]).toEqual([
      res.body.route.nodes[0].coordinates.lat,
      res.body.route.nodes[0].coordinates.lng
    ]);
  });

  test('POST /api/routes calculates Accessible route avoiding stairs', async () => {
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

    // Verify floor transition and elevator instruction
    expect(res.body.route.floor_transitions.length).toBeGreaterThan(0);
    expect(res.body.route.instructions.some(i => i.includes('elevator'))).toBe(true);
  });
});
