// api.ts - Enhanced API endpoints with error handling for MSC Wound Care System

import { Hono } from "hono";
import { validator } from "hono/validator";
import { HTTPException } from "hono/http-exception";
import { config } from "./config";
import { validate, validateCompleteForm } from "./validation";
import { createDocumentProcessor } from "./document-processor";

// Create API router
export const api = new Hono({ strict: false });

// Error handling middleware
api.use("*", async (c, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }
    
    console.error("API Error:", error);
    
    return c.json({
      success: false,
      error: error.message || "An unexpected error occurred",
      code: error.code || "INTERNAL_ERROR"
    }, error.status || 500);
  }
});

// Rate limiting middleware
api.use("*", async (c, next) => {
  // Simple IP-based rate limiting
  const ip = c.req.header("x-forwarded-for") || "unknown";
  
  // In a real implementation, this would use Redis or another store
  // For demo purposes, we'll use a simple in-memory approach
  const rateLimitStore = globalThis._rateLimitStore = globalThis._rateLimitStore || {};
  
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 60; // 60 requests per minute
  
  // Initialize or clean up the store
  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = { count: 0, resetAt: now + windowMs };
  } else if (rateLimitStore[ip].resetAt < now) {
    rateLimitStore[ip] = { count: 0, resetAt: now + windowMs };
  }
  
  // Increment count
  rateLimitStore[ip].count++;
  
  // Check limit
  if (rateLimitStore[ip].count > maxRequests) {
    return c.json({
      success: false,
      error: "Rate limit exceeded",
      code: "RATE_LIMIT_EXCEEDED"
    }, 429);
  }
  
  // Add rate limit headers
  c.header("X-RateLimit-Limit", maxRequests.toString());
  c.header("X-RateLimit-Remaining", Math.max(0, maxRequests - rateLimitStore[ip].count).toString());
  c.header("X-RateLimit-Reset", Math.ceil(rateLimitStore[ip].resetAt / 1000).toString());
  
  return next();
});

// Forward to n8n webhook
api.post("/webhook", async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate required fields
    if (body.message === undefined) {
      throw new HTTPException(400, { message: "Missing required field: message" });
    }
    
    const webhookUrl = config.N8N_WEBHOOK_URL;
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Webhook error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Webhook error:", error);
    
    return c.json({
      success: false,
      error: error.message || "Failed to connect to the webhook service",
      code: "WEBHOOK_ERROR"
    }, error.status || 500);
  }
});

// Form status API
api.get("/forms/status", async (c) => {
  try {
    // Query parameters for filtering
    const patientName = c.req.query("patient");
    const formType = c.req.query("type");
    const status = c.req.query("status");
    const manufacturer = c.req.query("manufacturer");
    const fromDate = c.req.query("fromDate");
    const toDate = c.req.query("toDate");
    
    // In a real implementation, this would query a database
    // For demo purposes, we'll use static data and apply filters
    let forms = [
      {
        id: "form-123",
        date: "2025-03-19",
        patientName: "John Smith",
        formType: "Insurance Verification",
        manufacturer: "Legacy Medical",
        status: "completed"
      },
      {
        id: "form-124",
        date: "2025-03-18",
        patientName: "Maria Garcia",
        formType: "Agreement",
        manufacturer: "Stability Biologics",
        status: "processing"
      },
      {
        id: "form-125",
        date: "2025-03-15",
        patientName: "Robert Johnson",
        formType: "Order Form",
        manufacturer: "ACZ Distribution",
        status: "pending"
      },
      {
        id: "form-126",
        date: "2025-03-14",
        patientName: "Sarah Williams",
        formType: "Onboarding",
        manufacturer: "MedLife Solutions",
        status: "error"
      }
    ];
    
    // Apply filters
    if (patientName) {
      forms = forms.filter(form => 
        form.patientName.toLowerCase().includes(patientName.toLowerCase())
      );
    }
    
    if (formType) {
      forms = forms.filter(form => 
        form.formType.toLowerCase() === formType.toLowerCase()
      );
    }
    
    if (status) {
      forms = forms.filter(form => 
        form.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    if (manufacturer) {
      forms = forms.filter(form => 
        form.manufacturer.toLowerCase().includes(manufacturer.toLowerCase())
      );
    }
    
    if (fromDate) {
      forms = forms.filter(form => 
        new Date(form.date) >= new Date(fromDate)
      );
    }
    
    if (toDate) {
      forms = forms.filter(form => 
        new Date(form.date) <= new Date(toDate)
      );
    }
    
    return c.json({ 
      success: true,
      forms
    });
  } catch (error) {
    console.error("Form status error:", error);
    
    return c.json({
      success: false,
      error: error.message || "Failed to retrieve form status",
      code: "FORM_STATUS_ERROR"
    }, 500);
  }
});

// Client data API
api.get("/clients", async (c) => {
  try {
    // Query parameters for filtering
    const name = c.req.query("name");
    const facility = c.req.query("facility");
    const insurance = c.req.query("insurance");
    
    // In a real implementation, this would query a database
    // For demo purposes, we'll use static data and apply filters
    let clients = [
      {
        id: "client-123",
        name: "John Smith",
        facility: "Metro Wound Care Center",
        npi: "1234567890",
        insurance: "UnitedHealthcare",
        lastForm: "2025-03-19"
      },
      {
        id: "client-124",
        name: "Maria Garcia",
        facility: "City Medical Group",
        npi: "2345678901",
        insurance: "Aetna",
        lastForm: "2025-03-18"
      },
      {
        id: "client-125",
        name: "Robert Johnson",
        facility: "Riverdale Health",
        npi: "3456789012",
        insurance: "Cigna",
        lastForm: "2025-03-15"
      },
      {
        id: "client-126",
        name: "Sarah Williams",
        facility: "Lakeside Medical Center",
        npi: "4567890123",
        insurance: "Medicare",
        lastForm: "2025-03-14"
      }
    ];
    
    // Apply filters
    if (name) {
      clients = clients.filter(client => 
        client.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    
    if (facility) {
      clients = clients.filter(client => 
        client.facility.toLowerCase().includes(facility.toLowerCase())
      );
    }
    
    if (insurance) {
      clients = clients.filter(client => 
        client.insurance.toLowerCase().includes(insurance.toLowerCase())
      );
    }
    
    return c.json({ 
      success: true,
      clients
    });
  } catch (error) {
    console.error("Client data error:", error);
    
    return c.json({
      success: false,
      error: error.message || "Failed to retrieve client data",
      code: "CLIENT_DATA_ERROR"
    }, 500);
  }
});

// Document upload and processing API
api.post("/process-document", async (c) => {
  try {
    const formData = await c.req.formData();
    const files = formData.getAll("files") as File[];
    
    if (!files || files.length === 0) {
      throw new HTTPException(400, { message: "No files uploaded" });
    }
    
    // Process each document
    const documentProcessor = createDocumentProcessor();
    const results = await Promise.all(
      files.map(file => documentProcessor.processDocument(file))
    );
    
    return c.json({
      success: true,
      message: "Documents processed successfully",
      results
    });
  } catch (error) {
    console.error("Document processing error:", error);
    
    return c.json({
      success: false,
      error: error.message || "Failed to process documents",
      code: "DOCUMENT_PROCESSING_ERROR"
    }, error.status || 500);
  }
});

// Form validation API
api.post("/validate-form", validator("json", (value, c) => {
  if (!value || typeof value !== "object") {
    return c.json({
      success: false,
      error: "Invalid request body",
      code: "INVALID_REQUEST"
    }, 400);
  }
  return value;
}), async (c) => {
  try {
    const formData = await c.req.json();
    
    // Validate the complete form
    const validationResult = validateCompleteForm(formData);
    
    return c.json({
      success: true,
      valid: validationResult.valid,
      errors: validationResult.errors
    });
  } catch (error) {
    console.error("Form validation error:", error);
    
    return c.json({
      success: false,
      error: error.message || "Failed to validate form",
      code: "VALIDATION_ERROR"
    }, 500);
  }
});

// Form submission API
api.post("/submit-form", validator("json", (value, c) => {
  if (!value || typeof value !== "object") {
    return c.json({
      success: false,
      error: "Invalid request body",
      code: "INVALID_REQUEST"
    }, 400);
  }
  
  if (!value.manufacturerId) {
    return c.json({
      success: false,
      error: "Missing required field: manufacturerId",
      code: "MISSING_FIELD"
    }, 400);
  }
  
  if (!value.formType) {
    return c.json({
      success: false,
      error: "Missing required field: formType",
      code: "MISSING_FIELD"
    }, 400);
  }
  
  return value;
}), async (c) => {
  try {
    const formData = await c.req.json();
    
    // Validate the form data
    const validationResult = validateCompleteForm(formData);
    
    if (!validationResult.valid) {
      return c.json({
        success: false,
        error: "Form validation failed",
        validationErrors: validationResult.errors,
        code: "VALIDATION_FAILED"
      }, 400);
    }
    
    // In a real implementation, this would submit the form to the manufacturer's API
    // or generate a PDF and store it
    
    // For demo purposes, we'll simulate form generation
    const formId = `form-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    return c.json({
      success: true,
      message: "Form submitted successfully",
      formId,
      previewUrl: `/forms/${formId}/preview.pdf`,
      downloadUrl: `/forms/${formId}/download.pdf`
    });
  } catch (error) {
    console.error("Form submission error:", error);
    
    return c.json({
      success: false,
      error: error.message || "Failed to submit form",
      code: "SUBMISSION_ERROR"
    }, 500);
  }
});

// Email forms API
api.post("/email-forms", validator("json", (value, c) => {
  if (!value || typeof value !== "object") {
    return c.json({
      success: false,
      error: "Invalid request body",
      code: "INVALID_REQUEST"
    }, 400);
  }
  
  if (!value.email) {
    return c.json({
      success: false,
      error: "Missing required field: email",
      code: "MISSING_FIELD"
    }, 400);
  }
  
  if (!value.formIds || !Array.isArray(value.formIds) || value.formIds.length === 0) {
    return c.json({
      success: false,
      error: "Missing required field: formIds",
      code: "MISSING_FIELD"
    }, 400);
  }
  
  return value;
}), async (c) => {
  try {
    const { email, formIds, message } = await c.req.json();
    
    // In a real implementation, this would send an email with form attachments
    // For demo purposes, we'll just simulate success
    
    return c.json({
      success: true,
      message: "Forms sent successfully",
      recipientEmail: email,
      sentAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Email forms error:", error);
    
    return c.json({
      success: false,
      error: error.message || "Failed to send email",
      code: "EMAIL_ERROR"
    }, 500);
  }
});

// Health check endpoint
api.get("/health", (c) => c.json({ 
  status: "ok",
  version: "1.0.0",
  timestamp: new Date().toISOString()
}));
