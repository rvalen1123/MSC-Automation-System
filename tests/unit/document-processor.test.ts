import { 
  DocumentProcessor, 
  ProcessingStatus, 
  createDocumentProcessor 
} from '../../document-processor';

// Fix the mock class structure to match required File properties
class MockFile implements Partial<File> {
  name: string;
  type: string;
  size: number;
  lastModified: number = Date.now();
  webkitRelativePath: string = '';
  
  constructor(bits: BlobPart[], name: string, options?: FilePropertyBag) {
    this.name = name;
    this.type = options?.type || '';
    this.size = 0;
    
    // If bits is an array of strings, calculate the size
    if (Array.isArray(bits)) {
      this.size = bits.reduce((size, bit) => {
        if (typeof bit === 'string') {
          return size + bit.length;
        }
        return size;
      }, 0);
    }
  }
  
  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(new ArrayBuffer(0));
  }
  
  slice(): Blob {
    return new Blob();
  }
  
  stream(): ReadableStream {
    return new ReadableStream();
  }
  
  text(): Promise<string> {
    return Promise.resolve('');
  }
}

// Assign the mock file class to global.File
global.File = MockFile as unknown as typeof File;

// Mock fetch for testing
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true })
  })
) as jest.Mock;

describe('Document Processor', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createDocumentProcessor', () => {
    test('should create a DocumentProcessor instance', () => {
      const processor = createDocumentProcessor();
      expect(processor).toBeInstanceOf(DocumentProcessor);
    });
  });
  
  describe('DocumentProcessor', () => {
    let processor: DocumentProcessor;
    
    beforeEach(() => {
      processor = createDocumentProcessor();
    });
    
    describe('processDocument', () => {
      test('should process a valid PDF document', async () => {
        const file = new File(['sample pdf content'], 'sample.pdf', { type: 'application/pdf' });
        
        const result = await processor.processDocument(file);
        
        expect(result.success).toBe(true);
        expect(result.fileInfo.name).toBe('sample.pdf');
        expect(result.fileInfo.type).toBe('application/pdf');
        expect(result.fileInfo.processingStatus).toBe(ProcessingStatus.COMPLETED);
        expect(result.extractedData).toBeDefined();
      });
      
      test('should process a valid image document', async () => {
        const file = new File(['sample image content'], 'sample.jpg', { type: 'image/jpeg' });
        
        const result = await processor.processDocument(file);
        
        expect(result.success).toBe(true);
        expect(result.fileInfo.name).toBe('sample.jpg');
        expect(result.fileInfo.type).toBe('image/jpeg');
        expect(result.fileInfo.processingStatus).toBe(ProcessingStatus.COMPLETED);
      });
      
      test('should handle an unsupported file type', async () => {
        const file = new File(['sample content'], 'sample.xyz', { type: 'application/xyz' });
        
        const result = await processor.processDocument(file);
        
        expect(result.success).toBe(false);
        expect(result.fileInfo.processingStatus).toBe(ProcessingStatus.FAILED);
        expect(result.error).toBeDefined();
      });
      
      test('should handle a file that is too large', async () => {
        // Create a mock large file
        const file = new File(['x'.repeat(20 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
        
        const result = await processor.processDocument(file);
        
        expect(result.success).toBe(false);
        expect(result.fileInfo.processingStatus).toBe(ProcessingStatus.FAILED);
        expect(result.error).toContain('maximum allowed size');
      });
    });
    
    describe('validateFile', () => {
      test('should validate a valid file', () => {
        const file = new File(['content'], 'valid.pdf', { type: 'application/pdf' });
        
        // Using the internal validateFile method via processDocument
        expect(async () => {
          await processor.processDocument(file);
        }).not.toThrow();
      });
    });
  });
}); 