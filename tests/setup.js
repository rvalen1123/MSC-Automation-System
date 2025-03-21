// Jest setup file
// This file runs before each test

// Polyfill for fetch if needed (Node.js environments)
if (typeof global.fetch !== 'function') {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
    })
  );
}

// Polyfill for global objects if needed
if (typeof global.File !== 'function') {
  global.File = class MockFile {
    constructor(bits, name, options = {}) {
      this.name = name;
      this.size = bits.length;
      this.type = options.type || '';
      this.lastModified = Date.now();
    }
  };
}

if (typeof global.Blob !== 'function') {
  global.Blob = class MockBlob {
    constructor() {
      // Mock implementation
    }
  };
}

if (typeof global.ReadableStream !== 'function') {
  global.ReadableStream = class MockReadableStream {
    constructor() {
      // Mock implementation
    }
  };
}

// Set up testing environment
jest.setTimeout(30000); // 30 seconds

// Suppress console errors and warnings during tests
// Comment these out if you want to see them
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  if (args[0]?.includes && args[0].includes('[testing]')) {
    originalConsoleError(...args);
  }
  // Suppress other console errors
};

console.warn = (...args) => {
  if (args[0]?.includes && args[0].includes('[testing]')) {
    originalConsoleWarn(...args);
  }
  // Suppress other console warnings
};

// Clean up function to run after tests
afterAll(() => {
  // Restore original console functions
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;

  // Clean up any global mocks
  if (jest.isMockFunction(global.fetch)) {
    global.fetch.mockRestore();
  }
}); 