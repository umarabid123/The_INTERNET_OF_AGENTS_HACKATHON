const request = require('supertest');
const app = require('../server');

describe('API Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('OK');
  });
});

describe('Authentication API', () => {
  it('should register a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'Test123456',
      firstName: 'Test',
      lastName: 'User'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(userData.email);
    expect(response.body.data.token).toBeDefined();
  });

  it('should login user', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'Test123456'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });
});

describe('Search API', () => {
  it('should process natural language search', async () => {
    const searchQuery = {
      query: 'Find me flights from New York to London next week'
    };

    const response = await request(app)
      .post('/api/search/natural-language')
      .send(searchQuery)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });
});

describe('Coral Protocol API', () => {
  it('should get agent status', async () => {
    const response = await request(app)
      .get('/api/coral/agents/status')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('voice_agent');
    expect(response.body.data).toHaveProperty('booking_agent');
    expect(response.body.data).toHaveProperty('payment_agent');
  });

  it('should orchestrate a task', async () => {
    const taskData = {
      task: {
        type: 'search_and_recommend'
      },
      data: {
        query: 'Find hotels in Paris for next month'
      }
    };

    const response = await request(app)
      .post('/api/coral/orchestrate')
      .send(taskData)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.sessionId).toBeDefined();
  });
});