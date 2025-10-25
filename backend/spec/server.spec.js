const mod = require('../server');
// Si server.js fuese ESM, vendría como { default: app }
const app = mod.default || mod;

const request = require('supertest');

let server;

beforeAll((done) => {
  // Puerto efímero para no chocar con nada
  server = app.listen(0, done);
});

afterAll((done) => {
  if (server && server.close) {
    server.close(done);
  } else {
    done();
  }
});

describe('API', () => {
  it('GET /api/productos -> 200 y array con productos', async () => {
    const res = await request(server).get('/api/productos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('POST /api/register -> 201 y mensaje', async () => {
    const res = await request(server)
      .post('/api/register')
      .send({ nombre: 'Benja', email: 'benja@test.com', password: '123' });
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('registrado con éxito');
  });

  it('POST /api/login -> 200 y mensaje', async () => {
    const res = await request(server)
      .post('/api/login')
      .send({ email: 'benja@test.com', password: '123' });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('Bienvenido de vuelta');
  });
});
