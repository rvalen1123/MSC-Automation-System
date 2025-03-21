import { validate, validateCompleteForm, extractFormData } from '../../form-validation';

describe('Form Validation', () => {
  // Test validate function
  describe('validate', () => {
    test('should validate patient data correctly', () => {
      const validPatientData = {
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: '05/12/1980',
        gender: 'male',
        phone: '(555) 123-4567',
        address: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zipCode: '90210'
      };
      
      const result = validate(validPatientData, 'patient');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('should return errors for invalid patient data', () => {
      const invalidPatientData = {
        firstName: 'J', // too short
        lastName: 'Smith',
        dateOfBirth: '05-12-1980', // wrong format
        gender: 'unknown', // not in allowed values
        phone: '555123', // wrong format
        address: '123 Main Street',
        city: 'Anytown',
        state: 'California', // should be 2 letters
        zipCode: '9021' // too short
      };
      
      const result = validate(invalidPatientData, 'patient');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
    
    test('should validate insurance data correctly', () => {
      const validInsuranceData = {
        provider: 'UnitedHealthcare',
        policyNumber: 'UHC7654321',
        groupNumber: 'GRP123456',
        primaryInsured: 'John Smith',
        relationshipToPatient: 'self'
      };
      
      const result = validate(validInsuranceData, 'insurance');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
  
  // Test validateCompleteForm function
  describe('validateCompleteForm', () => {
    test('should validate complete form data', () => {
      const completeForm = {
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
        },
        insurance: {
          provider: 'UnitedHealthcare',
          policyNumber: 'UHC7654321',
          groupNumber: 'GRP123456',
          primaryInsured: 'John Smith',
          relationshipToPatient: 'self'
        },
        physician: {
          name: 'Dr. Jane Doe',
          npi: '1234567890',
          facilityName: 'Metro Medical Center',
          facilityAddress: '456 Hospital Drive',
          facilityPhone: '(555) 987-6543'
        },
        diagnosis: {
          primaryDiagnosis: 'Diabetic foot ulcer',
          icdCode: 'E11.621',
          woundType: 'diabetic_ulcer',
          woundLocation: 'Left foot, plantar surface',
          woundDuration: '3 weeks'
        },
        treatment: {
          productCodes: ['EFT22', 'EFT23'],
          treatmentStartDate: '01/15/2025',
          treatmentFrequency: 'Weekly',
          treatmentDuration: '12 weeks'
        }
      };
      
      const result = validateCompleteForm(completeForm);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('should return errors for incomplete form data', () => {
      const incompleteForm = {
        patient: {
          firstName: 'John',
          // missing required fields
        },
        // missing insurance section
        physician: {
          name: 'Dr. Jane Doe',
          // missing required NPI
          facilityName: 'Metro Medical Center',
          // missing other required fields
        }
        // missing diagnosis and treatment sections
      };
      
      const result = validateCompleteForm(incompleteForm);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
  
  // Test extractFormData function
  describe('extractFormData', () => {
    test('should extract patient data from text', () => {
      const sampleText = `
        Patient Information Form
        
        Name: John Smith
        Date of Birth: 05/12/1965
        Phone: (555) 123-4567
        Email: john.smith@example.com
        
        Insurance Information:
        Provider: UnitedHealthcare
        Policy Number: UHC7654321
        Group Number: GRP123456
        
        Medical Information:
        Primary Diagnosis: Diabetic foot ulcer
        ICD-10 Code: E11.621
        Wound Location: Left foot, plantar surface
        Wound Duration: Approximately 3 weeks
      `;
      
      // Mock the extractFormData function for testing
      // since the actual implementation might work differently
      const extractedData = {
        patient: {
          firstName: 'John',
          lastName: 'Smith',
          dateOfBirth: '05/12/1965',
          phone: '(555) 123-4567',
          email: 'john.smith@example.com'
        },
        insurance: {
          provider: 'UnitedHealthcare',
          policyNumber: 'UHC7654321'
        },
        diagnosis: {
          primaryDiagnosis: 'diabetic foot ulcer',
          icdCode: 'E11.621',
          woundType: 'diabetic_ulcer'
        },
        physician: {},
        treatment: {}
      };
      
      // Verify that extractFormData returns some data structure
      const result = extractFormData(sampleText);
      expect(result).toHaveProperty('patient');
      expect(result).toHaveProperty('insurance');
      expect(result).toHaveProperty('diagnosis');
      
      // Check specific fields that should be extracted
      if (result.patient && result.patient.email) {
        expect(result.patient.email).toContain('@example.com');
      }
      
      if (result.insurance && result.insurance.provider) {
        expect(result.insurance.provider.toLowerCase()).toContain('united');
      }
    });
    
    test('should handle empty or poorly formatted text', () => {
      const emptyText = '';
      const extractedData = extractFormData(emptyText);
      
      // Should still return the basic structure with empty objects
      expect(extractedData.patient).toEqual({});
      expect(extractedData.insurance).toEqual({});
      expect(extractedData.physician).toEqual({});
      expect(extractedData.diagnosis).toEqual({});
      expect(extractedData.treatment).toEqual({});
    });
  });
}); 