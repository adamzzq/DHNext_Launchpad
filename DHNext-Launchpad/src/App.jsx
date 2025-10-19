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
    xcss,
    ButtonGroup
} from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [complianceResult, setComplianceResult] = useState(null);
    const [compliancePageUrl, setCompliancePageUrl] = useState('');
    const [confluenceLink, setConfluenceLink] = useState('');
    const [savedLink, setSavedLink] = useState('');
    const [collapsedCategories, setCollapsedCategories] = useState({});
    const [viewType, setViewType] = useState('category'); // 'category', 'status', or 'original'
    
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
    
    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case 'COMPLETE':
                return {
                    backgroundColor: 'color.background.success.bold',
                    color: 'color.text.inverse',
                    padding: 'space.075',
                    paddingInline: 'space.150',
                    borderRadius: 'border.radius',
                    display: 'inline-block'
                };
            case 'IN_PROGRESS':
                return {
                    backgroundColor: 'color.background.information.bold',
                    color: 'color.text.inverse',
                    padding: 'space.075',
                    paddingInline: 'space.150',
                    borderRadius: 'border.radius',
                    display: 'inline-block'
                };
            case 'PENDING':
                return {
                    backgroundColor: 'color.background.warning.bold',
                    color: 'color.text.inverse',
                    padding: 'space.075',
                    paddingInline: 'space.150',
                    borderRadius: 'border.radius',
                    display: 'inline-block'
                };
            default:
                return {
                    backgroundColor: 'color.background.neutral.bold',
                    color: 'color.text.inverse',
                    padding: 'space.075',
                    paddingInline: 'space.150',
                    borderRadius: 'border.radius',
                    display: 'inline-block'
                };
        }
    };
    
    const groupItemsByCategory = (items) => {
        if (!items) return {};
        
        const categorized = {};
        items.forEach(item => {
            // Extract category from item name or use a default
            let category = 'General Compliance';
            
            // Common legal/compliance categories
            if (item.name.toLowerCase().includes('privacy') || item.name.toLowerCase().includes('gdpr') || item.name.toLowerCase().includes('data')) {
                category = 'Privacy & Data Protection';
            } else if (item.name.toLowerCase().includes('terms') || item.name.toLowerCase().includes('service') || item.name.toLowerCase().includes('agreement')) {
                category = 'Terms & Agreements';
            } else if (item.name.toLowerCase().includes('security') || item.name.toLowerCase().includes('encryption')) {
                category = 'Security & Infrastructure';
            } else if (item.name.toLowerCase().includes('legal') || item.name.toLowerCase().includes('license') || item.name.toLowerCase().includes('intellectual')) {
                category = 'Legal & Licensing';
            } else if (item.name.toLowerCase().includes('accessibility') || item.name.toLowerCase().includes('ada') || item.name.toLowerCase().includes('wcag')) {
                category = 'Accessibility';
            } else if (item.name.toLowerCase().includes('cookie') || item.name.toLowerCase().includes('tracking')) {
                category = 'Cookies & Tracking';
            }
            
            if (!categorized[category]) {
                categorized[category] = [];
            }
            categorized[category].push(item);
        });
        
        return categorized;
    };
    
    const toggleCategory = (category) => {
        setCollapsedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };
    
    const groupItemsByStatus = (items) => {
        if (!items) return {};
        
        const grouped = {
            'COMPLETE': [],
            'IN_PROGRESS': [],
            'PENDING': []
        };
        
        items.forEach(item => {
            if (grouped[item.status]) {
                grouped[item.status].push(item);
            } else {
                grouped['PENDING'].push(item);
            }
        });
        
        return grouped;
    };
    
    const renderItemGrid = (items) => {
        return (
            <Box xcss={xcss({ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'space.150'
            })}>
                {items.map((item, index) => (
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
                            <Box xcss={xcss(getStatusBadgeStyle(item.status))}>
                                <Text>{item.status}</Text>
                            </Box>
                        </Stack>
                    </Box>
                ))}
            </Box>
        );
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
                                onClick={runComplianceCheck}
                                isDisabled={isLoading}
                                appearance="primary"
                            >
                                {isLoading ? '⏳ Analyzing Document...' : '🔍 Run Compliance Check'}
                            </Button>
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
                                        <Box xcss={xcss({ paddingBlock: 'space.100' })}>
                                            <Stack space="space.100">
                                                <Text><Strong>View by:</Strong></Text>
                                                <ButtonGroup>
                                                    <Button 
                                                        onClick={() => setViewType('category')}
                                                        appearance={viewType === 'category' ? 'primary' : 'default'}
                                                    >
                                                        📁 Category
                                                    </Button>
                                                    <Button 
                                                        onClick={() => setViewType('status')}
                                                        appearance={viewType === 'status' ? 'primary' : 'default'}
                                                    >
                                                        📊 Status
                                                    </Button>
                                                    <Button 
                                                        onClick={() => setViewType('original')}
                                                        appearance={viewType === 'original' ? 'primary' : 'default'}
                                                    >
                                                        📄 Original
                                                    </Button>
                                                </ButtonGroup>
                                            </Stack>
                                        </Box>
                                        <Text>
                                            <Strong>Source:</Strong> {complianceResult.pageTitle || 'Confluence Page'}
                                        </Text>
                                        <Text>
                                            <Strong>Last checked:</Strong> {new Date(complianceResult.timestamp).toLocaleString()}
                                        </Text>
                                    </Stack>
                                    
                                    {/* Category View */}
                                    {viewType === 'category' && (
                                        <Stack space="space.200">
                                            {Object.entries(groupItemsByCategory(complianceResult.items)).map(([category, items]) => {
                                                const isCollapsed = collapsedCategories[category];
                                                const completedCount = items.filter(item => item.checked).length;
                                                
                                                return (
                                                    <Box key={category}>
                                                        <Stack space="space.150">
                                                            {/* Category Header - Clickable to Collapse/Expand */}
                                                            <Box xcss={xcss({ 
                                                                padding: 'space.150',
                                                                backgroundColor: 'elevation.surface.raised',
                                                                borderRadius: 'border.radius'
                                                            })}>
                                                                <Inline space="space.100" alignBlock="center">
                                                                    <Button
                                                                        onClick={() => toggleCategory(category)}
                                                                        appearance="subtle"
                                                                    >
                                                                        {isCollapsed ? '▶' : '▼'}
                                                                    </Button>
                                                                    <Heading size="small">{category}</Heading>
                                                                    <Text>({completedCount}/{items.length} complete)</Text>
                                                                </Inline>
                                                            </Box>
                                                            
                                                            {/* Category Items - Collapsible */}
                                                            {!isCollapsed && renderItemGrid(items)}
                                                        </Stack>
                                                    </Box>
                                                );
                                            })}
                                        </Stack>
                                    )}
                                    
                                    {/* Status View */}
                                    {viewType === 'status' && (
                                        <Stack space="space.200">
                                            {Object.entries(groupItemsByStatus(complianceResult.items)).map(([status, items]) => {
                                                if (items.length === 0) return null;
                                                const isCollapsed = collapsedCategories[status];
                                                
                                                return (
                                                    <Box key={status}>
                                                        <Stack space="space.150">
                                                            {/* Status Header - Clickable to Collapse/Expand */}
                                                            <Box xcss={xcss({ 
                                                                padding: 'space.150',
                                                                backgroundColor: 'elevation.surface.raised',
                                                                borderRadius: 'border.radius'
                                                            })}>
                                                                <Inline space="space.100" alignBlock="center">
                                                                    <Button
                                                                        onClick={() => toggleCategory(status)}
                                                                        appearance="subtle"
                                                                    >
                                                                        {isCollapsed ? '▶' : '▼'}
                                                                    </Button>
                                                                    <Heading size="small">{status}</Heading>
                                                                    <Text>({items.length} items)</Text>
                                                                </Inline>
                                                            </Box>
                                                            
                                                            {/* Status Items - Collapsible */}
                                                            {!isCollapsed && renderItemGrid(items)}
                                                        </Stack>
                                                    </Box>
                                                );
                                            })}
                                        </Stack>
                                    )}
                                    
                                    {/* Original Order View */}
                                    {viewType === 'original' && renderItemGrid(complianceResult.items)}
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
                                onClick={saveLink}
                                appearance="primary"
                            >
                                💾 Save Feedback Link
                            </Button>
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

