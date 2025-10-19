import Resolver from '@forge/resolver';
import { storage } from '@forge/api';

const resolver = new Resolver();

// Get initial data from storage
resolver.define('getInitialData', async () => {
    const complianceResult = await storage.get('complianceResult');
    const confluenceLink = await storage.get('confluenceLink');
    return { complianceResult, confluenceLink };
});

// Run compliance check and save to storage
resolver.define('runComplianceCheck', async ({ payload }) => {
    const { fakeResponse } = payload;
    
    // Save to storage
    await storage.set('complianceResult', fakeResponse);
    
    return fakeResponse;
});

// Save Confluence link to storage
resolver.define('saveConfluenceLink', async ({ payload }) => {
    const { link } = payload;
    
    await storage.set('confluenceLink', link);
    
    return { success: true };
});

export const handler = resolver.getDefinitions();
