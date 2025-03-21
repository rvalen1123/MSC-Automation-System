// validation.ts - Form validation utilities for MSC Wound Care Form System

// Data validation types
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// Validation rules for different form types
const validationRules = {
  patient: {
    firstName: {
      required: true,
      minLength: 2,
      pattern: /^[A-Za-z\s\-']+$/
    },
    lastName: {
      required: true,
      minLength: 2,
      pattern: /^[A-Za-z\s\-']+$/
    },
    dateOfBirth: {
      required: true,
      pattern: /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/
    },
    gender: {
      required: true,
      oneOf: ['male', 'female', 'other', 'prefer_not_to_say']
    },
    email: {
      required: false,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    phone: {
      required: true,
      pattern: /^\(\d{3}\) \d{3}-\d{4}$|^\d{10}$|^\d{3}-\d{3}-\d{4}$/
    },
    address: {
      required: true,
      minLength: 5
    },
    city: {
      required: true,
      minLength: 2
    },
    state: {
      required: true,
      length: 2
    },
    zipCode: {
      required: true,
      pattern: /^\d{5}(-\d{4})?$/
    }
  },
  
  insurance: {
    provider: {
      required: true,
      minLength: 2
    },
    policyNumber: {
      required: true,
      minLength: 5
    },
    groupNumber: {
      required: false
    },
    primaryInsured: {
      required: true,
      minLength: 2
    },
    relationshipToPatient: {
      required: true,
      oneOf: ['self', 'spouse', 'child', 'other']
    },
    secondaryInsurance: {
      required: false
    }
  },
  
  physician: {
    name: {
      required: true,
      minLength: 2
    },
    npi: {
      required: true,
      pattern: /^\d{10}$/
    },
    facilityName: {
      required: true,
      minLength: 2
    },
    facilityAddress: {
      required: true,
      minLength: 5
    },
    facilityPhone: {
      required: true,
      pattern: /^\(\d{3}\) \d{3}-\d{4}$|^\d{10}$|^\d{3}-\d{3}-\d{4}$/
    },
    facilityFax: {
      required: false,
      pattern: /^\(\d{3}\) \d{3}-\d{4}$|^\d{10}$|^\d{3}-\d{3}-\d{4}$/
    }
  },
  
  diagnosis: {
    primaryDiagnosis: {
      required: true,
      minLength: 2
    },
    icdCode: {
      required: true,
      pattern: /^[A-Z0-9]{1,7}(\.[A-Z0-9]{1,4})?$/
    },
    secondaryDiagnosis: {
      required: false
    },
    woundType: {
      required: true,
      oneOf: ['diabetic_ulcer', 'pressure_ulcer', 'venous_ulcer', 'arterial_ulcer', 'surgical_wound', 'traumatic_wound', 'other']
    },
    woundLocation: {
      required: true
    },
    woundDuration: {
      required: true
    }
  },
  
  treatment: {
    productCodes: {
      required: true,
      minItems: 1
    },
    treatmentStartDate: {
      required: true,
      pattern: /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/
    },
    treatmentFrequency: {
      required: true
    },
    treatmentDuration: {
      required: true
    },
    previousTreatments: {
      required: false
    }
  }
};

// Generic validation function
export function validate(data: Record<string, any>, ruleSet: string): ValidationResult {
  const rules = validationRules[ruleSet];
  if (!rules) {
    throw new Error(`Validation rules not found for: ${ruleSet}`);
  }
  
  const result: ValidationResult = {
    valid: true,
    errors: []
  };
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];
    
    // Check required fields
    if (fieldRules.required && (value === undefined || value === null || value === '')) {
      result.valid = false;
      result.errors.push({
        field,
        message: `${formatFieldName(field)} is required`
      });
      continue; // Skip other validations if required field is missing
    }
    
    // Skip validation for empty optional fields
    if (!fieldRules.required && (value === undefined || value === null || value === '')) {
      continue;
    }
    
    // Validate minimum length
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      result.valid = false;
      result.errors.push({
        field,
        message: `${formatFieldName(field)} must be at least ${fieldRules.minLength} characters`
      });
    }
    
    // Validate exact length
    if (fieldRules.length && value.length !== fieldRules.length) {
      result.valid = false;
      result.errors.push({
        field,
        message: `${formatFieldName(field)} must be exactly ${fieldRules.length} characters`
      });
    }
    
    // Validate pattern (regex)
    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      result.valid = false;
      result.errors.push({
        field,
        message: `${formatFieldName(field)} has an invalid format`
      });
    }
    
    // Validate oneOf (enumeration)
    if (fieldRules.oneOf && !fieldRules.oneOf.includes(value)) {
      result.valid = false;
      result.errors.push({
        field,
        message: `${formatFieldName(field)} must be one of: ${fieldRules.oneOf.join(', ')}`
      });
    }
    
    // Validate minimum items (for arrays)
    if (Array.isArray(value) && fieldRules.minItems && value.length < fieldRules.minItems) {
      result.valid = false;
      result.errors.push({
        field,
        message: `${formatFieldName(field)} must have at least ${fieldRules.minItems} item(s)`
      });
    }
  }
  
  return result;
}

// Format field name for error messages
function formatFieldName(field: string): string {
  return field
    // Insert space before capital letters
    .replace(/([A-Z])/g, ' $1')
    // Replace underscores with spaces
    .replace(/_/g, ' ')
    // Capitalize first letter
    .replace(/^./, str => str.toUpperCase())
    // Trim any extra spaces
    .trim();
}

// Validate complete form data across all sections
export function validateCompleteForm(formData: Record<string, any>): ValidationResult {
  // Combine results from all sections
  const patientValidation = validate(formData.patient || {}, 'patient');
  const insuranceValidation = validate(formData.insurance || {}, 'insurance');
  const physicianValidation = validate(formData.physician || {}, 'physician');
  const diagnosisValidation = validate(formData.diagnosis || {}, 'diagnosis');
  const treatmentValidation = validate(formData.treatment || {}, 'treatment');
  
  const result: ValidationResult = {
    valid: patientValidation.valid && 
           insuranceValidation.valid && 
           physicianValidation.valid && 
           diagnosisValidation.valid && 
           treatmentValidation.valid,
    errors: [
      ...patientValidation.errors,
      ...insuranceValidation.errors,
      ...physicianValidation.errors,
      ...diagnosisValidation.errors,
      ...treatmentValidation.errors
    ]
  };
  
  return result;
}

// Form data extraction utilities
export function extractFormData(input: string): Record<string, any> {
  const formData: Record<string, any> = {
    patient: {},
    insurance: {},
    physician: {},
    diagnosis: {},
    treatment: {}
  };
  
  // Extract patient name (FirstName LastName)
  const namePattern = /\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/g;
  const nameMatch = namePattern.exec(input);
  if (nameMatch) {
    formData.patient.firstName = nameMatch[1];
    formData.patient.lastName = nameMatch[2];
  }
  
  // Extract date of birth (MM/DD/YYYY)
  const dobPattern = /\b(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d\b/;
  const dobMatch = dobPattern.exec(input);
  if (dobMatch) {
    formData.patient.dateOfBirth = dobMatch[0];
  }
  
  // Extract phone number
  const phonePattern = /\b\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/;
  const phoneMatch = phonePattern.exec(input);
  if (phoneMatch) {
    formData.patient.phone = phoneMatch[0];
  }
  
  // Extract email
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
  const emailMatch = emailPattern.exec(input);
  if (emailMatch) {
    formData.patient.email = emailMatch[0];
  }
  
  // Extract insurance information
  const insuranceProviders = [
    'Aetna', 'Anthem', 'Blue Cross', 'Blue Shield', 'Cigna', 'Humana',
    'Kaiser', 'Medicaid', 'Medicare', 'Tricare', 'UnitedHealthcare', 'UHC'
  ];
  
  for (const provider of insuranceProviders) {
    if (input.includes(provider)) {
      formData.insurance.provider = provider;
      break;
    }
  }
  
  // Extract policy number patterns
  const policyPattern = /\b([A-Z0-9]{5,})\b/;
  const policyMatch = policyPattern.exec(input);
  if (policyMatch) {
    formData.insurance.policyNumber = policyMatch[0];
  }
  
  // Extract diagnosis information
  const diagnosisList = [
    'diabetic ulcer', 'diabetic foot ulcer', 'pressure ulcer', 'venous ulcer',
    'arterial ulcer', 'surgical wound', 'traumatic wound'
  ];
  
  for (const diagnosis of diagnosisList) {
    if (input.toLowerCase().includes(diagnosis)) {
      formData.diagnosis.primaryDiagnosis = diagnosis;
      
      // Map to wound type
      if (diagnosis.includes('diabetic')) {
        formData.diagnosis.woundType = 'diabetic_ulcer';
      } else if (diagnosis.includes('pressure')) {
        formData.diagnosis.woundType = 'pressure_ulcer';
      } else if (diagnosis.includes('venous')) {
        formData.diagnosis.woundType = 'venous_ulcer';
      } else if (diagnosis.includes('arterial')) {
        formData.diagnosis.woundType = 'arterial_ulcer';
      } else if (diagnosis.includes('surgical')) {
        formData.diagnosis.woundType = 'surgical_wound';
      } else if (diagnosis.includes('traumatic')) {
        formData.diagnosis.woundType = 'traumatic_wound';
      } else {
        formData.diagnosis.woundType = 'other';
      }
      
      break;
    }
  }
  
  // Extract ICD code pattern
  const icdPattern = /\b[A-Z]\d{2}(\.\d{1,2})?\b/;
  const icdMatch = icdPattern.exec(input);
  if (icdMatch) {
    formData.diagnosis.icdCode = icdMatch[0];
  }
  
  return formData;
}
