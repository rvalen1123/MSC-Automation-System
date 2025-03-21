# MSC Wound Care Form Automation System

A comprehensive system for automating wound care forms with AI assistance, document processing, and integration with n8n and DocuSeal.

## Features

- AI-driven chat interface for form completion assistance
- Document upload and processing with OCR
- Form validation and submission
- Integration with n8n for workflow automation
- DocuSeal for digital form signing
- Form status tracking
- Responsive UI with tabbed interface

## Project Structure

```
├── api.ts               # API endpoints and routes
├── config.ts            # Configuration settings
├── document-processor.ts # Document processing logic
├── form-validation.ts   # Form validation utilities
├── index.ts             # Main application entry point
├── template.ts          # HTML template with UI components
├── public/              # Static assets
│   └── forms-json/      # JSON form templates
├── tests/               # Test files
│   ├── e2e/             # End-to-end tests
│   ├── integration/     # Integration tests
│   ├── unit/            # Unit tests
│   └── setup.js         # Jest setup file
├── jest.config.js       # Jest configuration
└── package.json         # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun runtime
- n8n instance for workflow automation
- DocuSeal account for form signing

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/msc-wound-care-automation.git
   cd msc-wound-care-automation
   ```

2. Install dependencies:

   ```
   npm install
   ```

   or with Bun:

   ```
   bun install
   ```

3. Configure environment variables:
   Create a `.env` file with the following variables:

   ```
   PORT=3000
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/msc-wound-care
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_FUNCTIONS_URL=your-supabase-functions-url
   DOCUSEAL_URL=https://your-docuseal-instance.com
   DOCUSEAL_API_KEY=your-docuseal-api-key
   ```

4. Start the development server:

   ```
   npm run dev
   ```

   or with Bun:

   ```
   bun dev
   ```

5. Open your browser to `http://localhost:3000`

## Testing

The project uses Jest for testing with a comprehensive test suite covering unit, integration, and end-to-end tests.

### Test Structure

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test API endpoints and interactions between components
- **End-to-End Tests**: Test the application as a whole from the user's perspective

### Running Tests

- Run all tests:

  ```
  npm test
  ```

- Run unit tests:

  ```
  npm run test:unit
  ```

- Run integration tests:

  ```
  npm run test:integration
  ```

- Run end-to-end tests:

  ```
  npm run test:e2e
  ```

- Generate coverage report:

  ```
  npm run test:coverage
  ```

### Test Mocking

The test suite uses Jest's mocking capabilities to mock external dependencies:

- `fetch` for API calls
- `File` and related browser APIs for document processing
- Global objects needed for browser compatibility

## Deployment

The application is configured for deployment on Railway:

1. Install Railway CLI:

   ```
   npm install -g @railway/cli
   ```

2. Login to Railway:

   ```
   railway login
   ```

3. Deploy the application:

   ```
   railway up
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Hono](https://hono.dev/) - Lightweight web framework
- [n8n](https://n8n.io/) - Workflow automation
- [DocuSeal](https://www.docuseal.co/) - Form signing service
