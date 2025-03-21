import { JSDOM } from 'jsdom';
import { homePage } from '../../template';

describe('HTML Template', () => {
  let dom: JSDOM;
  let document: Document;
  
  beforeEach(() => {
    // Create a new JSDOM instance with the template HTML
    dom = new JSDOM(homePage.toString());
    document = dom.window.document;
  });
  
  test('should render the correct page title', () => {
    expect(document.title).toBe('MSC Wound Care - Automated Form System');
  });
  
  test('should include the header with correct title', () => {
    const headerTitle = document.querySelector('.app-title');
    expect(headerTitle).not.toBeNull();
    expect(headerTitle?.textContent?.trim()).toContain('MSC Wound Care Forms');
  });
  
  test('should include the header with subtitle', () => {
    const subtitle = document.querySelector('.app-subtitle');
    expect(subtitle).not.toBeNull();
    expect(subtitle?.textContent?.trim()).toContain('Automated Form System');
  });
  
  test('should have navigation tabs', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    expect(tabButtons.length).toBeGreaterThan(0);
    
    // Check if we have the expected tabs
    const tabNames = Array.from(tabButtons).map(tab => tab.textContent?.trim());
    expect(tabNames).toContain('New Form');
    expect(tabNames).toContain('Form Status');
    expect(tabNames).toContain('Settings');
  });
  
  test('should have chat interface', () => {
    const chatContainer = document.querySelector('.chat-container');
    expect(chatContainer).not.toBeNull();
    
    const chatMessages = document.querySelector('.chat-messages');
    expect(chatMessages).not.toBeNull();
    
    const chatInput = document.querySelector('.chat-input');
    expect(chatInput).not.toBeNull();
    
    const sendButton = document.querySelector('#sendButton');
    expect(sendButton).not.toBeNull();
  });
  
  test('should have document upload area', () => {
    const uploadArea = document.querySelector('.upload-area');
    expect(uploadArea).not.toBeNull();
    
    const fileUpload = document.querySelector('#fileUpload');
    expect(fileUpload).not.toBeNull();
  });
  
  test('should have form status section', () => {
    const formStatus = document.querySelector('#formStatus');
    expect(formStatus).not.toBeNull();
    
    const formStatusList = document.querySelector('#formStatusList');
    expect(formStatusList).not.toBeNull();
  });
  
  test('should have settings section', () => {
    const settings = document.querySelector('#settings');
    expect(settings).not.toBeNull();
    
    const formGroups = settings?.querySelectorAll('.form-group');
    expect(formGroups?.length).toBeGreaterThan(0);
  });
  
  test('should include JavaScript for functionality', () => {
    const scripts = document.querySelectorAll('script');
    expect(scripts.length).toBeGreaterThan(0);
    
    // Find the script with app initialization
    let hasInitScript = false;
    scripts.forEach(script => {
      if (script.textContent?.includes('initApp')) {
        hasInitScript = true;
      }
    });
    
    expect(hasInitScript).toBe(true);
  });
}); 