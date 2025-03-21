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
  SMTP_HOST: 'smtp.office365.com',
  SMTP_PORT: 587,
  SMTP_SECURE: false,
  SMTP_USER: 'forms@msc-wound-care.com',
  SMTP_PASSWORD: '',
  EMAIL_FROM: 'MSC Wound Care Forms <forms@msc-wound-care.com>',
  
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
  
  // Supabase configuration
  SUPABASE_URL: 'https://pxlzjrjcqwhskyxazyc.supabase.co',
  SUPABASE_ANON_KEY: '',
  SUPABASE_FUNCTIONS_URL: 'https://pxlzjrjcqwhskyxazyc.functions.supabase.co',
  
  // DocuSeal configuration
  DOCUSEAL_URL: 'https://docuseal.co',
  DOCUSEAL_API_KEY: '',
  
  // Manufacturer specific configuration
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
    },
    advanced: {
      name: 'Advanced Solution',
      formTypes: ['agreement', 'ivr', 'order', 'onboarding'],
      templateIds: {
        agreement: 'template_advanced_agreement',
        ivr: 'template_advanced_ivr',
        order: 'template_advanced_order',
        onboarding: 'template_advanced_onboarding'
      }
    },
    aczdistribution: {
      name: 'ACZ Distribution',
      formTypes: ['agreement', 'ivr', 'order'],
      templateIds: {
        agreement: 'template_acz_agreement',
        ivr: 'template_acz_ivr',
        order: 'template_acz_order'
      }
    },
    medlife: {
      name: 'MedLife Solutions',
      formTypes: ['agreement', 'ivr', 'order'],
      templateIds: {
        agreement: 'template_medlife_agreement',
        ivr: 'template_medlife_ivr',
        order: 'template_medlife_order'
      }
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
