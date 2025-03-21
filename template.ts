import { Hono } from "hono";
import { html } from "hono/html";
import { serveStatic } from "hono/bun";

const app = new Hono();

// Serve static files
app.use("/static/*", serveStatic({ root: "./public" }));

// Create the HTML template with all client-side code encapsulated
const homePage = html`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MSC Wound Care - Automated Form System</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
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
            font-family: 'Inter', sans-serif;
            color: var(--text);
            background-color: var(--bg-light);
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
            background: linear-gradient(90deg, #3b6eb3 0%, #38a169 100%);
        }
        
        .app-title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .app-title svg {
            width: 28px;
            height: 28px;
        }
        
        .app-subtitle {
            font-weight: 400;
            opacity: 0.9;
            font-size: 15px;
        }
        
        .app-body {
            padding: 40px;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 24px;
            color: var(--text);
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
        
        .card-options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .card-option {
            border: 2px solid var(--border);
            border-radius: 12px;
            padding: 24px;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
        }
        
        .card-option::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 0;
            background-color: var(--primary);
            transition: height 0.3s ease;
        }
        
        .card-option:hover {
            border-color: var(--primary-light);
            background-color: var(--primary-light);
            transform: translateY(-2px);
        }
        
        .card-option.selected {
            border-color: var(--primary);
            background-color: var(--primary-light);
        }
        
        .card-option.selected::before {
            height: 100%;
        }
        
        .card-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            background-color: var(--primary-light);
            border-radius: 12px;
            margin-bottom: 16px;
        }
        
        .card-icon svg {
            width: 24px;
            height: 24px;
            color: var(--primary);
        }
        
        .card-option.selected .card-icon {
            background-color: var(--primary);
        }
        
        .card-option.selected .card-icon svg {
            color: white;
        }
        
        .card-title {
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 6px;
        }
        
        .card-description {
            font-size: 14px;
            color: var(--text-light);
        }
        
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
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
            font-family: 'Inter', sans-serif;
        }
        
        .form-control:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(59, 110, 179, 0.2);
            outline: none;
        }
        
        .form-hint {
            font-size: 13px;
            color: var(--text-light);
            margin-top: 8px;
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
            font-family: 'Inter', sans-serif;
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
        
        .btn-block {
            display: flex;
            width: 100%;
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
        
        .upload-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 16px;
            color: var(--primary);
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
        
        .chat-container {
            display: flex;
            flex-direction: column;
            height: 65vh;
            max-height: 550px;
        }
        
        .chat-messages {
            flex-grow: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            background-color: var(--bg-light);
            border-radius: 12px;
            margin-bottom: 20px;
        }
        
        .message {
            max-width: 80%;
            padding: 14px 18px;
            border-radius: 18px;
            position: relative;
            animation: fadeIn 0.3s ease;
        }
        
        .user-message {
            background-color: var(--primary);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }
        
        .assistant-message {
            background-color: #f0f0f5;
            color: var(--text);
            align-self: flex-start;
            border-bottom-left-radius: 4px;
        }
        
        .chat-input {
            display: flex;
            gap: 12px;
        }
        
        .chat-input .form-control {
            flex-grow: 1;
            border-radius: 24px;
            padding-left: 20px;
            padding-right: 20px;
        }
        
        .btn-send {
            border-radius: 50%;
            width: 48px;
            height: 48px;
            padding: 0;
            background-color: var(--primary);
            color: white;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        
        .btn-send:hover {
            transform: scale(1.05);
        }
        
        .chat-actions {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }
        
        .document-preview {
            margin-top: 30px;
            padding: 20px;
            border-radius: 12px;
            background-color: var(--secondary-light);
            border-left: 4px solid var(--secondary);
            display: none;
            animation: slideUp 0.4s ease;
        }
        
        .document-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
        }
        
        .document-icon {
            width: 40px;
            height: 40px;
            background-color: var(--secondary);
            color: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;
        }
        
        .document-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
        }
        
        .document-subtitle {
            font-size: 14px;
            color: var(--text-light);
        }
        
        .document-links {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 15px;
        }
        
        .document-link {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            border-radius: 8px;
            background-color: white;
            transition: transform 0.2s ease;
        }
        
        .document-link:hover {
            transform: translateY(-2px);
        }
        
        .document-link-icon {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--primary-light);
            border-radius: 6px;
            color: var(--primary);
        }
        
        .form-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        
        .form-table th {
            text-align: left;
            padding: 12px 16px;
            background-color: var(--primary-light);
            color: var(--primary);
            font-weight: 600;
            font-size: 14px;
        }
        
        .form-table td {
            padding: 12px 16px;
            border-bottom: 1px solid var(--border);
            font-size: 14px;
        }
        
        .form-table tr:hover {
            background-color: var(--bg-light);
        }
        
        .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .status-pending {
            background-color: #FEF3C7;
            color: #92400E;
        }
        
        .status-processing {
            background-color: #E0F2FE;
            color: #0369A1;
        }
        
        .status-completed {
            background-color: #DCFCE7;
            color: #166534;
        }
        
        .status-error {
            background-color: #FEE2E2;
            color: #B91C1C;
        }
        
        .loader {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 0.8s linear infinite;
            display: none;
        }
        
        .manufacturer-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .manufacturer-card {
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: center;
        }
        
        .manufacturer-card:hover {
            border-color: var(--primary);
            background-color: var(--primary-light);
            transform: translateY(-2px);
        }
        
        .manufacturer-card.selected {
            border-color: var(--primary);
            background-color: var(--primary-light);
        }
        
        .manufacturer-logo {
            height: 60px;
            margin-bottom: 12px;
        }
        
        .manufacturer-name {
            font-weight: 600;
            font-size: 15px;
        }
        
        .form-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
        }
        
        .progress-bar-container {
            width: 100%;
            height: 6px;
            background-color: var(--border);
            border-radius: 3px;
            margin-bottom: 30px;
            overflow: hidden;
        }
        
        .progress-bar {
            height: 100%;
            background-color: var(--primary);
            width: 0;
            transition: width 0.3s ease;
        }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
            .app-body {
                padding: 24px;
            }
            
            .card-options, .form-grid, .manufacturer-grid {
                grid-template-columns: 1fr;
            }
            
            .btn {
                padding: 10px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="app">
            <header class="app-header">
                <div class="app-title">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    MSC Wound Care Forms
                </div>
                <div class="app-subtitle">Automated Form System with AI Assistance</div>
            </header>
            
            <div class="app-body">
                <!-- Tab Navigation -->
                <div class="tab-container">
                    <div class="tab-navigation">
                        <button class="tab-button active" data-tab="newForm">New Form</button>
                        <button class="tab-button" data-tab="formStatus">Form Status</button>
                        <button class="tab-button" data-tab="clientData">Client Database</button>
                        <button class="tab-button" data-tab="settings">Settings</button>
                    </div>
                    
                    <!-- Tab: New Form -->
                    <div id="newForm" class="tab-content active">
                        <h2 class="section-title">Create New Form</h2>
                        
                        <div class="card-options">
                            <div class="card-option" id="formUploadOption" onclick="selectFormType('upload')">
                                <div class="card-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <h3 class="card-title">Upload Documents</h3>
                                <p class="card-description">Upload PDFs, scans, or images to auto-fill forms</p>
                            </div>
                            
                            <div class="card-option selected" id="formAssistantOption" onclick="selectFormType('assistant')">
                                <div class="card-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                    </svg>
                                </div>
                                <h3 class="card-title">AI Assistant</h3>
                                <p class="card-description">Complete forms through guided conversation</p>
                            </div>
                        </div>
                        
                        <!-- Upload Area (initially hidden) -->
                        <div id="uploadArea" class="upload-area" style="display: none;" onclick="triggerFileUpload()">
                            <div class="upload-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <h3 class="upload-title">Upload Documents</h3>
                            <p class="upload-description">Drag & drop files or click to browse</p>
                            <p class="upload-description">Supported formats: PDF, JPG, PNG, DOC, DOCX</p>
                            <input type="file" id="fileUpload" style="display: none;" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onchange="handleFileUpload(this.files)">
                            <button class="btn btn-outline">Select Files</button>
                        </div>
                        
                        <!-- AI Assistant Chat (initially visible) -->
                        <div id="aiAssistant">
                            <div class="progress-bar-container">
                                <div id="formProgress" class="progress-bar" style="width: 10%;"></div>
                            </div>
                            
                            <div class="chat-container">
                                <div id="chatMessages" class="chat-messages">
                                    <!-- Welcome message -->
                                    <div class="message assistant-message">
                                        Welcome to the MSC Wound Care Form Assistant! I'll help you complete the forms you need. First, could you tell me about the patient you need forms for? Is this for a new or existing patient?
                                    </div>
                                </div>
                                
                                <div class="chat-input">
                                    <textarea id="userMessage" class="form-control" placeholder="Type your message..." rows="1"></textarea>
                                    <button id="sendButton" class="btn btn-send" onclick="sendMessage()">
                                        <div id="loader" class="loader"></div>
                                        <svg id="sendIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Document Preview Section -->
                            <div id="documentPreview" class="document-preview" style="display: none;">
                                <div class="document-header">
                                    <div class="document-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                            <path d="M9 15l2 2 4-4"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <div class="document-title">Forms Ready</div>
                                        <div id="documentDetails" class="document-subtitle">Your verification forms are ready</div>
                                    </div>
                                </div>
                                
                                <div id="documentLinks" class="document-links"></div>
                                
                                <div class="form-actions" style="margin-top: 20px;">
                                    <button class="btn btn-outline" onclick="downloadAllForms()">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Download All
                                    </button>
                                    <button class="btn btn-primary" onclick="sendFormsByEmail()">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                            <polyline points="22,6 12,13 2,6"></polyline>
                                        </svg>
                                        Send by Email
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Tab: Form Status -->
                    <div id="formStatus" class="tab-content">
                        <h2 class="section-title">Form Status Tracking</h2>
                        
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Search by patient name, form type, or date...">
                        </div>
                        
                        <table class="form-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Patient</th>
                                    <th>Form Type</th>
                                    <th>Manufacturer</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>03/19/2025</td>
                                    <td>John Smith</td>
                                    <td>Insurance Verification</td>
                                    <td>Legacy Medical</td>
                                    <td><span class="status-badge status-completed">Completed</span></td>
                                    <td>
                                        <button class="btn btn-outline" style="padding: 4px 10px;">View</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>03/18/2025</td>
                                    <td>Maria Garcia</td>
                                    <td>Agreement</td>
                                    <td>Stability Biologics</td>
                                    <td><span class="status-badge status-processing">Processing</span></td>
                                    <td>
                                        <button class="btn btn-outline" style="padding: 4px 10px;">View</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>03/15/2025</td>
                                    <td>Robert Johnson</td>
                                    <td>Order Form</td>
                                    <td>ACZ Distribution</td>
                                    <td><span class="status-badge status-pending">Pending</span></td>
                                    <td>
                                        <button class="btn btn-outline" style="padding: 4px 10px;">View</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>03/14/2025</td>
                                    <td>Sarah Williams</td>
                                    <td>Onboarding</td>
                                    <td>MedLife Solutions</td>
                                    <td><span class="status-badge status-error">Error</span></td>
                                    <td>
                                        <button class="btn btn-outline" style="padding: 4px 10px;">View</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Tab: Client Database -->
                    <div id="clientData" class="tab-content">
                        <h2 class="section-title">Client Database</h2>
                        
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Search clients...">
                        </div>
                        
                        <table class="form-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Facility</th>
                                    <th>NPI</th>
                                    <th>Insurance</th>
                                    <th>Last Form</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>John Smith</td>
                                    <td>Metro Wound Care Center</td>
                                    <td>1234567890</td>
                                    <td>UnitedHealthcare</td>
                                    <td>03/19/2025</td>
                                    <td>
                                        <button class="btn btn-outline" style="padding: 4px 10px;">Edit</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Maria Garcia</td>
                                    <td>City Medical Group</td>
                                    <td>2345678901</td>
                                    <td>Aetna</td>
                                    <td>03/18/2025</td>
                                    <td>
                                        <button class="btn btn-outline" style="padding: 4px 10px;">Edit</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Robert Johnson</td>
                                    <td>Riverdale Health</td>
                                    <td>3456789012</td>
                                    <td>Cigna</td>
                                    <td>03/15/2025</td>
                                    <td>
                                        <button class="btn btn-outline" style="padding: 4px 10px;">Edit</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Sarah Williams</td>
                                    <td>Lakeside Medical Center</td>
                                    <td>4567890123</td>
                                    <td>Medicare</td>
                                    <td>03/14/2025</td>
                                    <td>
                                        <button class="btn btn-outline" style="padding: 4px 10px;">Edit</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <div style="text-align: center; margin-top: 20px;">
                            <button class="btn btn-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add New Client
                            </button>
                        </div>
                    </div>
                    
                    <!-- Tab: Settings -->
                    <div id="settings" class="tab-content">
                        <h2 class="section-title">System Settings</h2>
                        
                        <div class="form-group">
                            <label class="form-label">Integration Settings</label>
                            <div class="form-grid">
                                <div>
                                    <label class="form-label">CRM Integration</label>
                                    <select class="form-control">
                                        <option>Enabled</option>
                                        <option>Disabled</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="form-label">ERP Connection</label>
                                    <select class="form-control">
                                        <option>Enabled</option>
                                        <option>Disabled</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Email Notifications</label>
                            <div class="form-grid">
                                <div>
                                    <label class="form-label">Form Completion Alerts</label>
                                    <select class="form-control">
                                        <option>Enabled</option>
                                        <option>Disabled</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="form-label">Status Change Notifications</label>
                                    <select class="form-control">
                                        <option>Enabled</option>
                                        <option>Disabled</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Default Form Settings</label>
                            <div class="form-grid">
                                <div>
                                    <label class="form-label">Output Format</label>
                                    <select class="form-control">
                                        <option>PDF</option>
                                        <option>DOCX</option>
                                        <option>Both</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="form-label">Auto-Save Drafts</label>
                                    <select class="form-control">
                                        <option>Every 5 minutes</option>
                                        <option>Every 10 minutes</option>
                                        <option>Disabled</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button class="btn btn-outline">Reset to Default</button>
                            <button class="btn btn-primary">Save Settings</button>
                        </div>
                    </div>
                </div>
                        
                        <!-- Form Type Selection -->
                        <div class="form-group">
                            <label class="form-label">Form Type</label>
                            <div class="form-grid">
                                <div class="card-option" onclick="selectFormCategory('agreement')">
                                    <div class="card-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 class="card-title">Agreement</h3>
                                    <p class="card-description">Manufacturer agreements and contracts</p>
                                </div>
                                
                                <div class="card-option" onclick="selectFormCategory('ivr')">
                                    <div class="card-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h3 class="card-title">Insurance Verification</h3>
                                    <p class="card-description">Insurance verification requests</p>
                                </div>
                                
                                <div class="card-option" onclick="selectFormCategory('onboarding')">
                                    <div class="card-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                    </div>
                                    <h3 class="card-title">Onboarding</h3>
                                    <p class="card-description">New client or facility onboarding</p>
                                </div>
                                
                                <div class="card-option" onclick="selectFormCategory('order')">
                                    <div class="card-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <h3 class="card-title">Order Form</h3>
                                    <p class="card-description">Product orders and requisitions</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Manufacturer Selection -->
                        <div class="form-group">
                            <label class="form-label">Select Manufacturers</label>
                            <div class="manufacturer-grid">
                                <div class="manufacturer-card" onclick="toggleManufacturer('legacy')">
                                    <div class="manufacturer-logo">
                                        <!-- Logo placeholder -->
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div class="manufacturer-name">Legacy Medical</div>
                                </div>
                                
                                <div class="manufacturer-card" onclick="toggleManufacturer('stability')">
                                    <div class="manufacturer-logo">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                    <div class="manufacturer-name">Stability Biologics</div>
                                </div>
                                
                                <div class="manufacturer-card" onclick="toggleManufacturer('advanced')">
                                    <div class="manufacturer-logo">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />