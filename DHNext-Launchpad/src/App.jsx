import React, { useState } from 'react';
import ForgeReconciler, { 
    Text, 
    Strong, 
    Button, 
    Textfield,
    Box,
    Stack,
    Heading,
    SectionMessage,
    Lozenge,
    Inline,
    xcss
} from '@forge/react';
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
    
    const getLozengeAppearance = (status) => {
        switch (status) {
            case 'COMPLETE':
                return 'success';
            case 'IN_PROGRESS':
                return 'inprogress';
            case 'PENDING':
                return 'default';
            default:
                return 'default';
        }
    };
    
    return (
        <Box xcss={xcss({ padding: 'space.300' })}>
            <Stack space="space.400">
                {/* Header */}
                <Box xcss={xcss({ paddingBottom: 'space.200', borderBottom: '2px solid', borderColor: 'color.border' })}>
                    <Stack space="space.100">
                        <Heading size="large">🚀 DHNext Launchpad</Heading>
                        <Text>Your all-in-one startup launch toolkit</Text>
                    </Stack>
                </Box>
                
                {/* Feature 1: Legal & Compliance Checker */}
                <Box xcss={xcss({ padding: 'space.300', backgroundColor: 'elevation.surface.raised', borderRadius: 'border.radius' })}>
                    <Stack space="space.300">
                        <Stack space="space.100">
                            <Heading size="medium">🔍 Legal & Compliance Checker</Heading>
                            <Text>AI-powered compliance verification from your Confluence documentation</Text>
                        </Stack>
                        
                        <Stack space="space.200">
                            <Textfield
                                name="compliancePageUrl"
                                label="Confluence Page URL"
                                placeholder="https://your-site.atlassian.net/wiki/spaces/.../pages/..."
                                onChange={(value) => {
                                    const actualValue = typeof value === 'object' && value !== null 
                                        ? (value.target?.value || value.value || '') 
                                        : (value || '');
                                    setCompliancePageUrl(actualValue);
                                }}
                                defaultValue=""
                            />
                            
                            <Button 
                                text={isLoading ? '⏳ Analyzing Document...' : '🔍 Run Compliance Check'}
                                onClick={runComplianceCheck}
                                isDisabled={isLoading}
                                appearance="primary"
                            />
                        </Stack>
                        
                        {complianceResult && complianceResult.status === 'error' && (
                            <SectionMessage title="Error" appearance="error">
                                <Text>{complianceResult.message}</Text>
                            </SectionMessage>
                        )}
                        
                        {complianceResult && complianceResult.status === 'success' && (
                            <Box xcss={xcss({ padding: 'space.200', backgroundColor: 'elevation.surface', borderRadius: 'border.radius' })}>
                                <Stack space="space.300">
                                    <Stack space="space.100">
                                        <Heading size="small">Compliance Results</Heading>
                                        <Text>
                                            <Strong>Source:</Strong> {complianceResult.pageTitle || 'Confluence Page'}
                                        </Text>
                                        <Text>
                                            <Strong>Last checked:</Strong> {new Date(complianceResult.timestamp).toLocaleString()}
                                        </Text>
                                    </Stack>
                                    
                                    {/* 3-column grid layout */}
                                    <Box xcss={xcss({ 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: 'space.150'
                                    })}>
                                        {complianceResult.items && complianceResult.items.map((item, index) => (
                                            <Box 
                                                key={index} 
                                                xcss={xcss({ 
                                                    padding: 'space.200', 
                                                    backgroundColor: 'elevation.surface.raised',
                                                    borderRadius: 'border.radius',
                                                    borderLeft: '4px solid',
                                                    borderColor: item.checked ? 'color.border.success' : 'color.border.warning',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    ':hover': {
                                                        backgroundColor: 'elevation.surface.hovered',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: 'elevation.shadow.overlay'
                                                    }
                                                })}
                                            >
                                                <Stack space="space.100">
                                                    <Text>{item.checked ? '✅' : '⏳'}</Text>
                                                    <Text><Strong>{item.name}</Strong></Text>
                                                    <Lozenge appearance={getLozengeAppearance(item.status)}>
                                                        {item.status}
                                                    </Lozenge>
                                                </Stack>
                                            </Box>
                                        ))}
                                    </Box>
                                </Stack>
                            </Box>
                        )}
                    </Stack>
                </Box>
                
                {/* Feature 2: Customer Validation Tracker */}
                <Box xcss={xcss({ padding: 'space.300', backgroundColor: 'elevation.surface.raised', borderRadius: 'border.radius' })}>
                    <Stack space="space.300">
                        <Stack space="space.100">
                            <Heading size="medium">📋 Customer Validation Tracker</Heading>
                            <Text>Track and organize customer feedback from Confluence</Text>
                        </Stack>
                        
                        <Stack space="space.200">
                            <Textfield
                                name="confluenceLink"
                                label="Confluence Feedback Page"
                                placeholder="https://your-site.atlassian.net/wiki/..."
                                onChange={(value) => {
                                    const actualValue = typeof value === 'object' && value !== null 
                                        ? (value.target?.value || value.value || '') 
                                        : (value || '');
                                    setConfluenceLink(actualValue);
                                }}
                                defaultValue=""
                            />
                            
                            <Button 
                                text="💾 Save Feedback Link"
                                onClick={saveLink}
                                appearance="primary"
                            />
                        </Stack>
                        
                        {savedLink && (
                            <SectionMessage title="Link Saved Successfully" appearance="success">
                                <Text>{savedLink}</Text>
                            </SectionMessage>
                        )}
                    </Stack>
                </Box>
                
                {/* Feature 3: Impact Metrics Summary */}
                <Box xcss={xcss({ padding: 'space.300', backgroundColor: 'elevation.surface.raised', borderRadius: 'border.radius' })}>
                    <Stack space="space.300">
                        <Stack space="space.100">
                            <Heading size="medium">📊 Impact Metrics Summary</Heading>
                            <Text>Key performance indicators at a glance</Text>
                        </Stack>
                        
                        <Inline space="space.300" spread="space-between">
                            <Box xcss={xcss({ padding: 'space.200', backgroundColor: 'elevation.surface', borderRadius: 'border.radius', flex: 1 })}>
                                <Stack space="space.100" alignInline="center">
                                    <Text>💰 Monthly Recurring Revenue</Text>
                                    <Heading size="large">$12,500</Heading>
                                    <Lozenge appearance="success">+15% MoM</Lozenge>
                                </Stack>
                            </Box>
                            
                            <Box xcss={xcss({ padding: 'space.200', backgroundColor: 'elevation.surface', borderRadius: 'border.radius', flex: 1 })}>
                                <Stack space="space.100" alignInline="center">
                                    <Text>� Churn Rate</Text>
                                    <Heading size="large">2.3%</Heading>
                                    <Lozenge appearance="success">-0.5% MoM</Lozenge>
                                </Stack>
                            </Box>
                            
                            <Box xcss={xcss({ padding: 'space.200', backgroundColor: 'elevation.surface', borderRadius: 'border.radius', flex: 1 })}>
                                <Stack space="space.100" alignInline="center">
                                    <Text>👥 Active Users</Text>
                                    <Heading size="large">1,247</Heading>
                                    <Lozenge appearance="success">+8% MoM</Lozenge>
                                </Stack>
                            </Box>
                        </Inline>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};

ForgeReconciler.render(<App />);

