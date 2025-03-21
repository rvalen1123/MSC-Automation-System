import { Hono } from 'hono';
import { api } from '../../api';

// Mock the dependencies
jest.mock('../../config', () => ({
  config: {
    N8N_WEBHOOK_URL: 'https://n8n.example.com/webhook',
    SUPABASE_FUNCTIONS_URL: 'https://example.supabase.co/functions',
    SUPABASE_ANON_KEY: 'test-key',
    MANUFACTURERS: {
      legacy: {
        name: 'Legacy Medical',
        formTypes: ['agreement', 'ivr', 'order'],
        templateIds: {
          agreement: 'template_legacy_agreement',
          ivr: 'template_legacy_ivr',
          order: 'template_legacy_order'
        }
      },
      stability: {
        name: 'Stability Biologics',
        formTypes: ['agreement', 'ivr', 'order'],
        templateIds: {
          agreement: 'template_stability_agreement',
          ivr: 'template_stability_ivr',
          order: 'template_stability_order'
        }
      }
    }
  }
}));

jest.mock('../../document-processor', () => {
  return {
    createDocumentProcessor: jest.fn().mockReturnValue({
      processDocument: jest.fn().mockResolvedValue({
        success: true,
        fileInfo: {
          id: 'test-file-id',
          name: 'test.pdf',
          type: 'application/pdf',
          size: 1024,
          uploadDate: new Date(),
          processingStatus: 'completed',
          extractedData: { patient: { firstName: 'John', lastName: 'Smith' } }
        },
        extractedData: { patient: { firstName: 'John', lastName: 'Smith' } },
        validationResult: { valid: true, errors: [] }
      })
    })
  };
});

jest.mock('../../form-validation', () => ({
  validate: jest.fn().mockReturnValue({ valid: true, errors: [] })
}));

// Mock fetch
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, message: 'Success' })
  })
) as jest.Mock;

// Helper function to make HTTP requests to Hono app
async function testClient(app: Hono, method: string, path: string, body?: any) {
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

describe('API Integration Tests', () => {
  let app: Hono;
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create a fresh instance of the app for each test
    app = new Hono();
    app.route('', api);
  });
  
  describe('Health Check Endpoint', () => {
    test('GET /health should return 200 OK', async () => {
      const res = await testClient(app, 'GET', '/health');
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.version).toBe('1.0.0');
      expect(res.body.timestamp).toBeDefined();
    });
  });
  
  describe('Form Templates Endpoint', () => {
    test('GET /form-templates should return manufacturers list', async () => {
      const res = await testClient(app, 'GET', '/form-templates');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.manufacturers).toHaveLength(2);
      expect(res.body.manufacturers[0].name).toBe('Legacy Medical');
      expect(res.body.manufacturers[1].name).toBe('Stability Biologics');
    });
  });
  
  describe('Form Status API', () => {
    test('GET /forms/status should return form status', async () => {
      const res = await testClient(app, 'GET', '/forms/status');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.forms)).toBe(true);
    });
    
    test('GET /forms/status with filters should filter results', async () => {
      const res = await testClient(app, 'GET', '/forms/status?manufacturer=Legacy&status=completed');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.forms)).toBe(true);
      // All returned forms should match the filter criteria
      res.body.forms.forEach((form: any) => {
        expect(form.manufacturer.includes('Legacy')).toBe(true);
        expect(form.status).toBe('completed');
      });
    });
  });
  
  describe('Form Validation API', () => {
    test('POST /validate-form should validate form data', async () => {
      const formData = {
        patient: {
          firstName: 'John',
          lastName: 'Smith',
          dateOfBirth: '05/12/1980',
          gender: 'male',
          phone: '(555) 123-4567',
          address: '123 Main Street',
          city: 'Anytown',
          state: 'CA',
          zipCode: '90210'
        }
      };
      
      const res = await testClient(app, 'POST', '/validate-form', formData);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.valid).toBe(true);
    });
    
    test('POST /validate-form should return 400 for invalid request', async () => {
      const res = await testClient(app, 'POST', '/validate-form', null);
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('Chat API', () => {
    test('POST /chat should forward to n8n webhook', async () => {
      const chatMessage = {
        message: 'Hello, I need help with a form',
        conversationId: '12345'
      };
      
      const res = await testClient(app, 'POST', '/chat', chatMessage);
      
      expect(res.status).toBe(200);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://n8n.example.com/webhook',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });
  });
  
  describe('Form Submission API', () => {
    test('POST /submit-form should submit form to DocuSeal', async () => {
      const formSubmission = {
        formId: 'test-form-id',
        formData: {
          patient: {
            firstName: 'John',
            lastName: 'Smith'
          }
        },
        patientInfo: {
          name: 'John Smith',
          email: 'john@example.com'
        }
      };
      
      const res = await testClient(app, 'POST', '/submit-form', formSubmission);
      
      expect(res.status).toBe(200);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://example.supabase.co/functions/create-docuseal-submission',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-key'
          })
        })
      );
    });
    
    test('POST /submit-form should return 400 for missing fields', async () => {
      const invalidSubmission = {
        // Missing required fields
        formId: 'test-form-id'
      };
      
      const res = await testClient(app, 'POST', '/submit-form', invalidSubmission);
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Missing required fields');
    });
  });
}); 