import app from '../../index';

// Mock fetch
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, message: 'Success' })
  })
) as jest.Mock;

// Helper function to make HTTP requests to Hono app
async function testClient(method: string, path: string, body?: any) {
  const url = new URL(path, 'http://localhost');
  const req = new Request(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  
  const res = await app.fetch(req);
  
  // Clone the response before reading the body
  const clonedRes = res.clone();
  
  // Parse the response body
  let responseBody;
  let responseText = '';
  
  const contentType = res.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    responseBody = await res.json();
    responseText = JSON.stringify(responseBody);
  } else {
    responseText = await res.text();
    responseBody = responseText;
  }
  
  return {
    status: clonedRes.status,
    body: responseBody,
    text: responseText,
    headers: Object.fromEntries(clonedRes.headers.entries())
  };
}

describe('E2E Tests - Main Application', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('Main Routes', () => {
    test('GET / should return the homepage HTML', async () => {
      const res = await testClient('GET', '/');
      
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/html');
      expect(res.text).toContain('MSC Wound Care');
      expect(res.text).toContain('<!DOCTYPE html>');
    });
    
    test('GET /api/health should return health status', async () => {
      const res = await testClient('GET', '/api/health');
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.version).toBe('1.0.0');
      expect(res.body.timestamp).toBeDefined();
    });
  });
  
  describe('API Routes', () => {
    test('GET /api/form-templates should return form templates', async () => {
      const res = await testClient('GET', '/api/form-templates');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.manufacturers)).toBe(true);
    });
    
    test('POST /api/chat should process chat message', async () => {
      const chatMessage = {
        message: 'Hello, I need help with forms',
        conversationId: '12345'
      };
      
      const res = await testClient('POST', '/api/chat', chatMessage);
      
      expect(res.status).toBe(200);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('Error Handling', () => {
    test('GET /non-existent-route should return 404', async () => {
      const res = await testClient('GET', '/non-existent-route');
      
      expect(res.status).toBe(404);
    });
    
    test('POST /api/chat with invalid body should return error', async () => {
      // Make fetch mock reject once
      global.fetch = jest.fn().mockImplementationOnce(() => 
        Promise.reject(new Error('Network error'))
      );
      
      const res = await testClient('POST', '/api/chat', {});
      
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeDefined();
    });
  });
  
  // Rate limiting tests are difficult to implement in E2E tests without modifying the code
  // We could test it if we create a custom middleware for testing that resets after each test
}); 