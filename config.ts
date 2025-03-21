// config.ts - Environment configuration for MSC Wound Care Form System

// Default configuration values
const defaultConfig = {
  // Server settings
  PORT: 3000,
  NODE_ENV: 'development',
  
  // API endpoints
  N8N_WEBHOOK_URL: 'https://n8n.medrep.exchange/webhook/msc-wound-care',
  
  // Document processing service
  DOCUMENT_PROCESSOR_URL: 'https://ocr-service.msc-wound-care.com/process',
  
  // Storage configuration
  STORAGE_TYPE: 'local', // Options: 'local', 's3', 'azure'
  STORAGE_PATH: './uploads',
  
  // S3 configuration (if using S3 storage)
  S3_BUCKET: 'msc-wound-care-forms',
  S3_REGION: 'us-east-1',
  
  // Email configuration
  SMTP_HOST: 'smtp.example.com',
  SMTP_PORT: 587,
  SMTP_SECURE: false,
  SMTP_USER: 'notifications@msc-wound-care.com',
  
  // Security settings
  SESSION_SECRET: 'changeme-in-production',
  ENCRYPTION_KEY: 'changeme-in-production',
  
  // Feature flags
  ENABLE_OCR: true,
  ENABLE_DOCUMENT_HISTORY: true,
  ENABLE_CLIENT_DATABASE: true,
  ENABLE_SYSTEM_INTEGRATION: true,
  
  // Form settings
  DEFAULT_FORM_FORMAT: 'pdf', // Options: 'pdf', 'docx', 'both'
  MAX_UPLOAD_SIZE_MB: 10,
  SUPPORTED_UPLOAD_FORMATS: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
  
  // Manufacturer specific configuration
  MANUFACTURERS: {
    legacy: {
      name: 'Legacy Medical',
      apiEndpoint: 'https://api.legacymedical.com/forms',
      requiresAuth: true
    },
    stability: {
      name: 'Stability Biologics',
      apiEndpoint: 'https://stability-bio.com/api/v2/forms',
      requiresAuth: true
    },
    advanced: {
      name: 'Advanced Solution',
      apiEndpoint: 'https://advsolution.com/api/forms',
      requiresAuth: false
    },
    aczdistribution: {
      name: 'ACZ Distribution',
      apiEndpoint: 'https://forms.aczdist.com/submit',
      requiresAuth: true
    },
    medlife: {
      name: 'MedLife Solutions',
      apiEndpoint: 'https://api.medlifesol.com/forms/new',
      requiresAuth: true
    }
  }
};

// Load environment variables and override defaults
function loadConfig() {
  const config = { ...defaultConfig };
  
  // Override with environment variables when available
  for (const [key, value] of Object.entries(defaultConfig)) {
    if (process.env[key] !== undefined) {
      // Handle type conversion for numeric values
      if (typeof value === 'number') {
        config[key] = Number(process.env[key]);
      } 
      // Handle type conversion for boolean values
      else if (typeof value === 'boolean') {
        config[key] = process.env[key].toLowerCase() === 'true';
      }
      // Handle JSON objects
      else if (typeof value === 'object' && !Array.isArray(value)) {
        try {
          config[key] = JSON.parse(process.env[key]);
        } catch (e) {
          // Keep default if JSON parse fails
          console.warn(`Failed to parse environment variable ${key}, using default`);
        }
      }
      // String values
      else {
        config[key] = process.env[key];
      }
    }
  }
  
  // Validate critical configuration
  if (config.NODE_ENV === 'production') {
    if (config.SESSION_SECRET === defaultConfig.SESSION_SECRET) {
      throw new Error('SESSION_SECRET must be changed in production');
    }
    if (config.ENCRYPTION_KEY === defaultConfig.ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY must be changed in production');
    }
  }
  
  return config;
}

export const config = loadConfig();
