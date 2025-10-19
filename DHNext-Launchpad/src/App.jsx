import React, { useState } from 'react';
import ForgeReconciler, { Text, Strong, Button, Textfield } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [complianceResult, setComplianceResult] = useState(null);
    const [compliancePageUrl, setCompliancePageUrl] = useState('');
    const [confluenceLink, setConfluenceLink] = useState('');
    const [savedLink, setSavedLink] = useState('');
    
    const runComplianceCheck = async () => {
        if (!compliancePageUrl.trim()) {
            console.log('Please enter a Confluence page URL');
            return;
        }
        
        console.log('Compliance check button clicked for:', compliancePageUrl);
        setIsLoading(true);
        
        try {
            // Call the backend to read and parse the Confluence page
            const result = await invoke('runComplianceCheck', { 
                confluencePageUrl: compliancePageUrl 
            });
            console.log('Backend returned:', result);
            setComplianceResult(result);
        } catch (error) {
            console.error('Error calling backend:', error);
            setComplianceResult({
                status: 'error',
                message: error.message || 'Failed to read Confluence page'
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const saveLink = async () => {
        if (confluenceLink.trim()) {
            try {
                await invoke('saveConfluenceLink', { link: confluenceLink });
                setSavedLink(confluenceLink);
                setConfluenceLink('');
            } catch (error) {
                console.error('Error saving link:', error);
            }
        }
    };
    
    return (
        <>
            <Strong>🚀 DHNext Launchpad - Startup Suite</Strong>
            <Text> </Text>
            
            {/* Feature 1: Legal & Compliance Checker */}
            <Strong>🔍 Legal & Compliance Checker</Strong>
            <Text>Verify startup compliance requirements from Confluence</Text>
            <Textfield
                name="compliancePageUrl"
                label="Confluence Page URL"
                placeholder="Enter Confluence page URL with compliance checklist..."
                onChange={(value) => {
                    console.log('Textfield onChange received:', typeof value, value);
                    // Forge Textfield might pass an event object, extract the value
                    const actualValue = typeof value === 'object' && value !== null 
                        ? (value.target?.value || value.value || '') 
                        : (value || '');
                    console.log('Setting compliancePageUrl to:', actualValue);
                    setCompliancePageUrl(actualValue);
                }}
                defaultValue=""
            />
            <Button 
                text={isLoading ? 'Reading Page...' : 'Run Compliance Check'}
                onClick={runComplianceCheck}
                isDisabled={isLoading}
            />
            
            {complianceResult && complianceResult.status === 'error' && (
                <>
                    <Text> </Text>
                    <Strong>❌ Error:</Strong>
                    <Text>{complianceResult.message}</Text>
                </>
            )}
            
            {complianceResult && complianceResult.status === 'success' && (
                <>
                    <Text> </Text>
                    <Strong>Compliance Status:</Strong>
                    {complianceResult.items && complianceResult.items.map((item, index) => (
                        <Text key={index}>
                            {item.checked ? '✅' : '⏳'} {item.name}: {item.status}
                        </Text>
                    ))}
                    <Text>Last checked: {new Date(complianceResult.timestamp).toLocaleString()}</Text>
                    <Text>Source: {complianceResult.pageTitle || 'Confluence Page'}</Text>
                </>
            )}
            
            <Text> </Text>
            <Text>─────────────────────</Text>
            <Text> </Text>
            
            {/* Feature 2: Customer Validation Tracker */}
            <Strong>📋 Customer Validation Tracker</Strong>
            <Text>Track customer feedback in Confluence</Text>
            <Textfield
                name="confluenceLink"
                label="Confluence Link"
                placeholder="Enter Confluence page URL..."
                onChange={(value) => {
                    const actualValue = typeof value === 'object' && value !== null 
                        ? (value.target?.value || value.value || '') 
                        : (value || '');
                    setConfluenceLink(actualValue);
                }}
                defaultValue=""
            />
            <Button 
                text="Save Link"
                onClick={saveLink}
            />
            
            {savedLink && (
                <>
                    <Text> </Text>
                    <Strong>Saved Link:</Strong>
                    <Text>📄 {savedLink}</Text>
                </>
            )}
        </>
    );
};

ForgeReconciler.render(<App />);

