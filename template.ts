import { html } from "hono/html";

// Component-based HTML template system
// Each component is a function that returns an HTML string

// CSS Styles
const styles = `
  :root {
    --primary: #3b6eb3;
    --primary-light: #edf2fa;
    --primary-dark: #2c5282;
    --secondary: #38a169;
    --secondary-light: #f0fff4;
    --secondary-dark: #276749;
    --accent: #ed8936;
    --text: #2d3748;
    --text-light: #718096;
    --bg: #ffffff;
    --bg-light: #f7fafc;
    --border: #e2e8f0;
    --shadow: rgba(0, 0, 0, 0.08);
    --error: #e53e3e;
    --success: #38a169;
    --warning: #ecc94b;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: var(--bg-light);
    color: var(--text);
    line-height: 1.5;
  }
  
  .container {
    max-width: 1100px;
    margin: 40px auto;
    padding: 0 20px;
  }
  
  .app {
    background-color: var(--bg);
    border-radius: 16px;
    box-shadow: 0 10px 25px var(--shadow);
    overflow: hidden;
  }
  
  .app-header {
    padding: 25px 30px;
    background-color: var(--primary);
    color: white;
    position: relative;
  }
  
  .app-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  }
  
  .app-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .app-subtitle {
    font-weight: 400;
    opacity: 0.9;
    font-size: 15px;
  }
  
  .app-body {
    padding: 40px;
  }
  
  .tab-container {
    margin-bottom: 30px;
  }
  
  .tab-navigation {
    display: flex;
    border-bottom: 2px solid var(--border);
    margin-bottom: 20px;
  }
  
  .tab-button {
    padding: 12px 20px;
    font-size: 15px;
    font-weight: 500;
    color: var(--text-light);
    background: none;
    border: none;
    cursor: pointer;
    position: relative;
    transition: color 0.2s ease;
  }
  
  .tab-button.active {
    color: var(--primary);
    font-weight: 600;
  }
  
  .tab-button.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--primary);
  }
  
  .tab-content {
    display: none;
  }
  
  .tab-content.active {
    display: block;
    animation: fadeIn 0.3s ease;
  }
  
  .form-group {
    margin-bottom: 24px;
  }
  
  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--text);
  }
  
  .form-control {
    width: 100%;
    padding: 12px 16px;
    font-size: 15px;
    border: 2px solid var(--border);
    border-radius: 8px;
    background-color: var(--bg);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  
  .form-control:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(59, 110, 179, 0.2);
    outline: none;
  }
  
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 24px;
    font-size: 15px;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  }
  
  .btn-primary {
    background-color: var(--primary);
    color: white;
  }
  
  .btn-primary:hover {
    background-color: var(--primary-dark);
    transform: translateY(-1px);
  }
  
  .btn-secondary {
    background-color: var(--secondary);
    color: white;
  }
  
  .btn-secondary:hover {
    background-color: var(--secondary-dark);
    transform: translateY(-1px);
  }
  
  .btn-outline {
    background-color: transparent;
    color: var(--primary);
    border: 2px solid var(--primary);
  }
  
  .btn-outline:hover {
    background-color: var(--primary-light);
  }
  
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 400px;
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }
  
  .chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
    background-color: var(--bg-light);
  }
  
  .message {
    max-width: 80%;
    padding: 14px 18px;
    border-radius: 18px;
    margin-bottom: 15px;
  }
  
  .user-message {
    background-color: var(--primary);
    color: white;
    align-self: flex-end;
    margin-left: auto;
    border-bottom-right-radius: 4px;
  }
  
  .assistant-message {
    background-color: var(--bg);
    color: var(--text);
    align-self: flex-start;
    border-bottom-left-radius: 4px;
  }
  
  .chat-input {
    display: flex;
    padding: 15px;
    background-color: var(--bg);
    border-top: 1px solid var(--border);
  }
  
  .chat-input .form-control {
    flex-grow: 1;
    margin-right: 10px;
  }
  
  .upload-area {
    border: 2px dashed var(--border);
    border-radius: 12px;
    padding: 30px;
    text-align: center;
    margin-bottom: 30px;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  
  .upload-area:hover {
    border-color: var(--primary);
    background-color: var(--primary-light);
  }
  
  .upload-title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 6px;
  }
  
  .upload-description {
    font-size: 14px;
    color: var(--text-light);
    margin-bottom: 16px;
  }
  
  .docuseal-container {
    margin-top: 30px;
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    height: 600px;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @media (max-width: 768px) {
    .app-body {
      padding: 24px;
    }
  }
`;

// Header component
const Header = () => html`
  <header class="app-header">
    <div class="app-title">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      MSC Wound Care Forms
    </div>
    <div class="app-subtitle">Automated Form System with AI Assistance</div>
  </header>
`;

// Navigation component
const Navigation = () => html`
  <div class="tab-navigation">
    <button class="tab-button active" data-tab="newForm">New Form</button>
    <button class="tab-button" data-tab="formStatus">Form Status</button>
    <button class="tab-button" data-tab="settings">Settings</button>
  </div>
`;

// Chat interface component
const ChatInterface = () => html`
  <div id="aiAssistant">
    <div class="chat-container">
      <div id="chatMessages" class="chat-messages">
        <!-- Messages will be added dynamically -->
        <div class="message assistant-message">
          Welcome to the MSC Wound Care Form Assistant! I'll help you complete the forms you need. What form would you like to work on today?
        </div>
      </div>
      <div class="chat-input">
        <input type="text" id="userMessage" class="form-control" placeholder="Type your message..." />
        <button id="sendButton" class="btn btn-primary">Send</button>
      </div>
    </div>
  </div>
`;

// Document upload component
const DocumentUpload = () => html`
  <div id="uploadArea" class="upload-area">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 16px; color: var(--primary);">
      <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
    <h3 class="upload-title">Upload Documents</h3>
    <p class="upload-description">Drag & drop files or click to browse</p>
    <p class="upload-description">Supported formats: PDF, JPG, PNG, DOC, DOCX</p>
    <input type="file" id="fileUpload" style="display: none;" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
    <button class="btn btn-outline">Select Files</button>
  </div>
`;

// Form status component 
const FormStatus = () => html`
  <div class="form-group">
    <input type="text" class="form-control" placeholder="Search forms..." />
  </div>
  <div id="formStatusList">
    <!-- Form status entries will be loaded dynamically -->
    <p>No forms found. Create a new form to get started.</p>
  </div>
`;

// DocuSeal container
const DocuSealContainer = () => html`
  <div id="docuseal-container" class="docuseal-container" style="display: none;">
    <!-- DocuSeal form will be embedded here -->
  </div>
`;

// JavaScript code for the app
const appScript = `
  // DOM elements
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  const chatMessages = document.getElementById('chatMessages');
  const userMessage = document.getElementById('userMessage');
  const sendButton = document.getElementById('sendButton');
  const uploadArea = document.getElementById('uploadArea');
  const fileUpload = document.getElementById('fileUpload');
  
  // Global variables
  let conversationId = localStorage.getItem('conversationId') || null;
  
  // Initialize the app
  function initApp() {
    // Set up event listeners
    setupTabNavigation();
    setupChatInterface();
    setupFileUpload();
    
    // Check for existing session
    if (conversationId) {
      fetchFormStatus(conversationId);
    }
  }
  
  // Tab navigation
  function setupTabNavigation() {
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons and content
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const tabId = button.dataset.tab;
        document.getElementById(tabId).classList.add('active');
      });
    });
  }
  
  // Chat interface
  function setupChatInterface() {
    sendButton.addEventListener('click', sendMessage);
    userMessage.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
  
  // Send message to API
  async function sendMessage() {
    const message = userMessage.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    userMessage.value = '';
    
    try {
      // Show loading indicator
      sendButton.disabled = true;
      sendButton.innerHTML = '<div class="spinner"></div>';
      
      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          conversationId
        })
      });
      
      const data = await response.json();
      
      // Store conversation ID
      if (data.conversationId) {
        conversationId = data.conversationId;
        localStorage.setItem('conversationId', conversationId);
      }
      
      // Add assistant message to chat
      if (data.message) {
        addMessageToChat(data.message, 'assistant');
      }
      
      // If forms were generated, show DocuSeal container
      if (data.formsGenerated && data.formInfo) {
        showDocuSealForms(data.formInfo);
      }
    } catch (error) {
      console.error('[testing] Error sending message:', error);
      addMessageToChat('Sorry, there was an error processing your request. Please try again.', 'assistant');
    } finally {
      // Reset button
      sendButton.disabled = false;
      sendButton.textContent = 'Send';
    }
  }
  
  // Add message to chat
  function addMessageToChat(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'assistant-message');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // File upload
  function setupFileUpload() {
    uploadArea.addEventListener('click', () => {
      fileUpload.click();
    });
    
    uploadArea.addEventListener('dragover', e => {
      e.preventDefault();
      uploadArea.classList.add('active');
    });
    
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('active');
    });
    
    uploadArea.addEventListener('drop', e => {
      e.preventDefault();
      uploadArea.classList.remove('active');
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files);
      }
    });
    
    fileUpload.addEventListener('change', () => {
      if (fileUpload.files.length > 0) {
        handleFileUpload(fileUpload.files);
      }
    });
  }
  
  // Handle file upload
  async function handleFileUpload(files) {
    if (!conversationId) {
      addMessageToChat('Please start a conversation first before uploading files.', 'assistant');
      return;
    }
    
    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append('files', file);
      }
      formData.append('conversationId', conversationId);
      
      // Show loading state
      uploadArea.innerHTML = '<div class="spinner"></div><p>Uploading and processing files...</p>';
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        addMessageToChat('Files uploaded successfully! Processing documents...', 'assistant');
        
        // Reset upload area
        uploadArea.innerHTML = \`
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 16px; color: var(--primary);">
            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <h3 class="upload-title">Upload Documents</h3>
          <p class="upload-description">Drag & drop files or click to browse</p>
          <p class="upload-description">Supported formats: PDF, JPG, PNG, DOC, DOCX</p>
          <button class="btn btn-outline">Select Files</button>
        \`;
      } else {
        addMessageToChat(\`Error uploading files: \${data.error}\`, 'assistant');
      }
    } catch (error) {
      console.error('[testing] Error uploading files:', error);
      addMessageToChat('Sorry, there was an error uploading your files. Please try again.', 'assistant');
      
      // Reset upload area
      uploadArea.innerHTML = \`
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 16px; color: var(--primary);">
          <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <h3 class="upload-title">Upload Documents</h3>
        <p class="upload-description">Drag & drop files or click to browse</p>
        <p class="upload-description">Supported formats: PDF, JPG, PNG, DOC, DOCX</p>
        <button class="btn btn-outline">Select Files</button>
      \`;
    }
  }
  
  // Fetch form status
  async function fetchFormStatus(conversationId) {
    try {
      const response = await fetch(\`/api/form-status/\${conversationId}\`);
      const data = await response.json();
      
      if (data.success && data.forms && data.forms.length > 0) {
        updateFormStatusList(data.forms);
      }
    } catch (error) {
      console.error('[testing] Error fetching form status:', error);
    }
  }
  
  // Update form status list
  function updateFormStatusList(forms) {
    const formStatusList = document.getElementById('formStatusList');
    formStatusList.innerHTML = '';
    
    forms.forEach(form => {
      const formElement = document.createElement('div');
      formElement.className = 'form-status-item';
      formElement.innerHTML = \`
        <div class="form-status-header">
          <h3>\${form.manufacturerName} - \${form.formType}</h3>
          <span class="status-badge status-\${form.status.toLowerCase()}">\${form.status}</span>
        </div>
        <div class="form-status-details">
          <p>Created: \${new Date(form.createdAt).toLocaleString()}</p>
          <button class="btn btn-outline" onclick="viewForm('\${form.formUrl}')">View Form</button>
        </div>
      \`;
      formStatusList.appendChild(formElement);
    });
  }
  
  // Show DocuSeal forms
  function showDocuSealForms(formInfo) {
    const docusealContainer = document.getElementById('docuseal-container');
    docusealContainer.style.display = 'block';
    
    // If we have form links, create DocuSeal iframe
    if (formInfo.formLinks && formInfo.formLinks.length > 0) {
      const firstForm = formInfo.formLinks[0];
      docusealContainer.innerHTML = \`
        <iframe 
          src="\${firstForm.previewUrl}" 
          width="100%" 
          height="100%" 
          frameborder="0"
          allow="camera; microphone; clipboard-write">
        </iframe>
      \`;
    }
  }
  
  // View form in DocuSeal
  function viewForm(formUrl) {
    const docusealContainer = document.getElementById('docuseal-container');
    docusealContainer.style.display = 'block';
    docusealContainer.innerHTML = \`
      <iframe 
        src="\${formUrl}" 
        width="100%" 
        height="100%" 
        frameborder="0"
        allow="camera; microphone; clipboard-write">
      </iframe>
    \`;
  }
  
  // Initialize the app when DOM is loaded
  document.addEventListener('DOMContentLoaded', initApp);
`;

// Main homepage HTML
const homePage = html`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MSC Wound Care - Automated Form System</title>
    <style>${styles}</style>
</head>
<body>
    <div class="container">
        <div class="app">
            ${Header()}
            
            <div class="app-body">
                <div class="tab-container">
                    ${Navigation()}
                    
                    <!-- Tab: New Form -->
                    <div id="newForm" class="tab-content active">
                        <h2>Create New Form</h2>
                        <p class="subtitle">Use our AI assistant or upload documents to complete forms.</p>
                        
                        ${ChatInterface()}
                        ${DocumentUpload()}
                        ${DocuSealContainer()}
                    </div>
                    
                    <!-- Tab: Form Status -->
                    <div id="formStatus" class="tab-content">
                        <h2>Form Status</h2>
                        <p class="subtitle">Track the status of your submitted forms.</p>
                        
                        ${FormStatus()}
                    </div>
                    
                    <!-- Tab: Settings -->
                    <div id="settings" class="tab-content">
                        <h2>Settings</h2>
                        <p class="subtitle">Configure your form preferences.</p>
                        
                        <div class="form-group">
                            <label class="form-label">Default Manufacturer</label>
                            <select class="form-control">
                                <option value="">Select a manufacturer</option>
                                <option value="legacy">Legacy Medical</option>
                                <option value="stability">Stability Biologics</option>
                                <option value="advanced">Advanced Solution</option>
                                <option value="acz">ACZ Distribution</option>
                                <option value="medlife">MedLife Solutions</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Document Storage</label>
                            <select class="form-control">
                                <option value="local">Local Storage</option>
                                <option value="s3">Amazon S3</option>
                            </select>
                        </div>
                        
                        <button class="btn btn-primary">Save Settings</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>${appScript}</script>
</body>
</html>`;

export { homePage };