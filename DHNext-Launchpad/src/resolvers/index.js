import Resolver from '@forge/resolver';
import { storage } from '@forge/api';
import api, { route } from '@forge/api';

const resolver = new Resolver();

// Get initial data from storage
resolver.define('getInitialData', async () => {
    const complianceResult = await storage.get('complianceResult');
    const confluenceLink = await storage.get('confluenceLink');
    return { complianceResult, confluenceLink };
});

// Read Confluence page and extract compliance items
resolver.define('runComplianceCheck', async ({ payload }) => {
    const { confluencePageUrl } = payload;
    
    try {
        // Extract page ID from URL
        // Example URL: https://yoursite.atlassian.net/wiki/spaces/SPACE/pages/123456/Page+Title
        const pageIdMatch = confluencePageUrl.match(/pages\/(\d+)/);
        
        if (!pageIdMatch) {
            throw new Error('Invalid Confluence URL format. Expected format: .../pages/123456/...');
        }
        
        const pageId = pageIdMatch[1];
        
        // Fetch the Confluence page content using REST API v2
        const response = await api.asApp().requestConfluence(
            route`/wiki/api/v2/pages/${pageId}?body-format=storage`
        );
        
        console.log('Confluence API response status:', response.status);
        
        const pageData = await response.json();
        console.log('Confluence page data structure:', JSON.stringify(pageData, null, 2));
        
        if (!pageData.body || !pageData.body.storage) {
            throw new Error(`Confluence page data missing body.storage. Received: ${JSON.stringify(pageData)}`);
        }
        
        const pageTitle = pageData.title;
        const pageContent = pageData.body.storage.value;
        
        console.log('Page content (first 500 chars):', pageContent.substring(0, 500));
        console.log('Page content length:', pageContent.length);
        
        // Parse the HTML content to extract compliance items
        // Look for patterns like:
        // - "Terms of Service: COMPLETE" or "✅ Terms of Service"
        // - "[x] Privacy Policy" or "☑ Privacy Policy"
        const items = extractComplianceItems(pageContent);
        console.log('Extracted items:', items);
        
        const result = {
            status: 'success',
            pageTitle: pageTitle,
            pageUrl: confluencePageUrl,
            items: items,
            timestamp: new Date().toISOString()
        };
        
        // Save to storage
        await storage.set('complianceResult', result);
        
        return result;
    } catch (error) {
        console.error('Error reading Confluence page:', error);
        return {
            status: 'error',
            message: error.message || 'Failed to read Confluence page',
            timestamp: new Date().toISOString()
        };
    }
});

// Helper function to extract compliance items from HTML content
function extractComplianceItems(htmlContent) {
    const items = [];
    
    // Extract content from CDATA sections if present
    let contentToProcess = htmlContent;
    const cdataMatch = htmlContent.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
    if (cdataMatch) {
        contentToProcess = cdataMatch[1];
        console.log('Extracted CDATA content');
    }
    
    // Decode HTML entities
    const decodedContent = contentToProcess
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    
    // Remove HTML tags but keep the text content
    const textContent = decodedContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    
    console.log('Text content to search (first 1000 chars):', textContent.substring(0, 1000));
    
    // Extended list of compliance topics to look for
    const topics = [
        'Terms of Service',
        'Privacy Policy',
        'Data Processing Agreement',
        'Cookie Policy',
        'GDPR Compliance',
        'CCPA Compliance',
        'SOC 2',
        'ISO 27001',
        'Encryption at Rest',
        'Encryption in Transit',
        'Access Controls',
        'Penetration Testing',
        'Business Registration',
        'Tax Compliance',
        'Trademark Registration',
        'Patent Filing',
        'Employee Handbook',
        'Background Checks',
        'Benefits Compliance',
        'User Agreement',
        'Acceptable Use Policy',
        'Security Policy'
    ];
    
    topics.forEach(topic => {
        // Check if the topic appears in the content (case insensitive)
        const topicRegex = new RegExp(topic, 'i');
        if (topicRegex.test(textContent)) {
            // Look for status indicators near the topic (within ~200 characters)
            const contextRegex = new RegExp(`${topic}.{0,200}(COMPLETE|IN[_\\s-]?PROGRESS|PENDING|TODO|DONE)`, 'i');
            const match = textContent.match(contextRegex);
            
            let status = 'PENDING';
            let checked = false;
            
            if (match) {
                const statusText = match[1].toUpperCase().replace(/[\s_-]/g, '_');
                console.log(`Found ${topic}: ${statusText}`);
                
                if (statusText.includes('COMPLETE') || statusText.includes('DONE')) {
                    status = 'COMPLETE';
                    checked = true;
                } else if (statusText.includes('PROGRESS')) {
                    status = 'IN_PROGRESS';
                    checked = false;
                } else {
                    status = 'PENDING';
                    checked = false;
                }
            }
            
            items.push({
                name: topic,
                status: status,
                checked: checked
            });
        }
    });
    
    // If no items found, return a default message
    if (items.length === 0) {
        items.push({
            name: 'No compliance items detected',
            status: 'INFO',
            checked: false
        });
    }
    
    return items;
}

// Save Confluence link to storage
resolver.define('saveConfluenceLink', async ({ payload }) => {
    const { link } = payload;
    
    await storage.set('confluenceLink', link);
    
    return { success: true };
});

export const handler = resolver.getDefinitions();
