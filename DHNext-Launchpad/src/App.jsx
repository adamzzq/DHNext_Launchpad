import React, { useState } from 'react';
import ForgeReconciler, { Text, Strong, Button, Textfield } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [complianceResult, setComplianceResult] = useState(null);
    const [confluenceLink, setConfluenceLink] = useState('');
    const [savedLink, setSavedLink] = useState('');
    
    const runComplianceCheck = async () => {
        console.log('Compliance check button clicked!');
        setIsLoading(true);
        
        // Fake Rovo response data
        const fakeResponse = {
            status: 'success',
            items: [
                { name: 'Terms of Service', status: 'COMPLETE', checked: true },
                { name: 'Privacy Policy', status: 'COMPLETE', checked: true },
                { name: 'Data Processing Agreement', status: 'COMPLETE', checked: true },
                { name: 'Cookie Policy', status: 'IN_PROGRESS', checked: false }
            ],
            timestamp: new Date().toISOString()
        };
        
        try {
            // Call the backend resolver
            const result = await invoke('runComplianceCheck', { fakeResponse });
            console.log('Backend returned:', result);
            setComplianceResult(result);
        } catch (error) {
            console.error('Error calling backend:', error);
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
            <Text>Verify startup compliance requirements</Text>
            <Button 
                text={isLoading ? 'Running Check...' : 'Run Compliance Check'}
                onClick={runComplianceCheck}
                isDisabled={isLoading}
            />
            
            {complianceResult && (
                <>
                    <Text> </Text>
                    <Strong>Compliance Status:</Strong>
                    {complianceResult.items && complianceResult.items.map((item, index) => (
                        <Text key={index}>
                            {item.checked ? '✅' : '⏳'} {item.name}: {item.status}
                        </Text>
                    ))}
                    <Text>Last checked: {new Date(complianceResult.timestamp).toLocaleString()}</Text>
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
                label="Confluence Page URL"
                placeholder="Paste Confluence URL here..."
                value={confluenceLink}
                onChange={(value) => setConfluenceLink(value)}
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

