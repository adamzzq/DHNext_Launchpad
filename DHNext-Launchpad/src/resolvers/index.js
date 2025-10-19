import Resolver from '@forge/resolver';
import { storage, fetch } from '@forge/api';
import api, { route } from '@forge/api';

const GEMINI_API_KEY = 'AIzaSyDbCxZypUUD2jVs6q-7t0JFVNB3xYmAtZY';

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
        
        // Use OpenAI to analyze the compliance document
        const items = await analyzeWithGemini(pageContent);
        console.log('AI extracted items:', items);
        
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

// Use Gemini AI to analyze compliance documents
async function analyzeWithGemini(documentContent) {
    try {
        // Extract text from CDATA if present
        let content = documentContent;
        const cdataMatch = documentContent.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
        if (cdataMatch) {
            content = cdataMatch[1];
        }
        
        // Remove HTML tags
        const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        
        console.log('Sending to Gemini, content length:', textContent.length);
        
        const prompt = `You are an expert legal compliance analyst. Analyze this compliance document and extract all compliance items with their status.

Document:
${textContent}

Return ONLY a JSON array of compliance items (no markdown, no explanation). Each item should have:
- name: The compliance topic (e.g., "Terms of Service", "GDPR Compliance")
- status: "COMPLETE", "IN_PROGRESS", or "PENDING"
- checked: true if complete, false otherwise

Example format: [{"name":"Terms of Service","status":"COMPLETE","checked":true}]`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 2000
                }
            })
        });
        
        console.log('Gemini response status:', response.status);
        const responseText = await response.text();
        console.log('Gemini raw response:', responseText.substring(0, 500));
        
        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status} - ${responseText}`);
        }
        
        const data = JSON.parse(responseText);
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid Gemini response structure');
        }
        
        const aiResponse = data.candidates[0].content.parts[0].text.trim();
        console.log('AI response content:', aiResponse);
        
        // Parse the JSON response
        // Remove markdown code blocks if present
        let jsonStr = aiResponse;
        const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            jsonStr = jsonMatch[1].trim();
        }
        
        const items = JSON.parse(jsonStr);
        
        // Validate and format the items
        if (!Array.isArray(items)) {
            throw new Error('AI did not return an array');
        }
        
        return items.map(item => ({
            name: item.name || 'Unknown',
            status: item.status || 'PENDING',
            checked: item.checked || false
        }));
        
    } catch (error) {
        console.error('Error in Gemini analysis:', error);
        // Fallback to a simple message
        return [{
            name: 'AI Analysis Failed: ' + error.message,
            status: 'INFO',
            checked: false
        }];
    }
}

// Save Confluence link to storage
resolver.define('saveConfluenceLink', async ({ payload }) => {
    const { link } = payload;
    
    await storage.set('confluenceLink', link);
    
    return { success: true };
});

export const handler = resolver.getDefinitions();
