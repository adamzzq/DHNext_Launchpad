# 🚀 DHNext Launchpad

**Streamline compliance, validate customers, and track key metrics—all in one place**

DHNext Launchpad is an Atlassian Forge app that provides startup teams with essential tools to manage legal compliance, customer validation, and impact metrics directly within their Jira workspace.

## Demo Site
[App](https://dubhacks.atlassian.net/jira/apps/157874ce-5f06-4dd1-b82d-bc77aadf1867/73b942a9-b71d-4f3d-880e-80606245276f)

[Sample Document](https://dubhacks.atlassian.net/wiki/spaces/~7120200a30f7e078a844609ce24f79837175a7/pages/14057622/Legal+Compliance+Checklist)
## ✨ Features

### 🔍 Legal & Compliance Checker
- **AI-Powered Analysis**: Uses Google Gemini AI to intelligently parse compliance documents from Confluence
- **Smart Categorization**: Automatically organizes compliance items into categories:
  - Privacy & Data Protection (GDPR, privacy policies)
  - Terms & Agreements (ToS, service agreements)
  - Security & Infrastructure
  - Legal & Licensing
  - Accessibility (ADA, WCAG)
  - Cookies & Tracking
- **Multiple Views**: Switch between Category, Status, and Original order views
- **Collapsible Sections**: Easily manage large compliance checklists
- **Visual Status Indicators**: Color-coded badges (Complete, In Progress, Pending)
- **3-Column Grid Layout**: Efficient use of screen space

### 📋 Customer Validation Tracker
- Save and manage Confluence links to customer feedback pages
- Quick access to validation documentation
- Persistent storage for easy reference

### 📊 Impact Metrics Summary
- At-a-glance dashboard for key performance indicators
- Track Monthly Recurring Revenue (MRR)
- Monitor Churn Rate
- View Active Users count
- Month-over-month growth indicators

## 🛠️ Technology Stack

- **Platform**: Atlassian Forge
- **Runtime**: Node.js 22.x
- **UI Framework**: Forge React UI Kit
- **AI Integration**: Google Gemini API (gemini-2.0-flash-exp)
- **APIs**: 
  - Confluence REST API v2
  - Forge Storage API
  - Google Generative Language API

## 📋 Prerequisites

- Atlassian account with Jira access
- Forge CLI installed (`npm install -g @forge/cli`)
- Node.js 18.x or higher
- Google Gemini API key (for AI features)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/adamzzq/DHNext_Launchpad.git
cd DHNext_Launchpad/DHNext-Launchpad
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Keys
Update the `GEMINI_API_KEY` in `src/resolvers/index.js`:
```javascript
const GEMINI_API_KEY = 'your-gemini-api-key-here';
```

### 4. Login to Forge
```bash
forge login
```

### 5. Deploy to Development
```bash
forge deploy --environment development
```

### 6. Install on Your Site
```bash
forge install --environment development
```

Select your Jira site and approve the required permissions.

### 7. Run Tunnel for Development (Optional)
```bash
forge tunnel
```

## 🔑 Required Permissions

The app requires the following Atlassian permissions:
- `read:page:confluence` - Read Confluence pages
- `read:confluence-content.all` - Access Confluence content
- `storage:app` - Store app data
- External fetch to `generativelanguage.googleapis.com` - Google Gemini API access

## 📖 Usage

### Legal Compliance Check

1. Navigate to the DHNext Launchpad page in your Jira global pages
2. Enter a Confluence page URL containing your compliance checklist
3. Click "🔍 Run Compliance Check"
4. View results organized by category or status
5. Use the expand/collapse arrows to manage long lists

**Example Confluence URL:**
```
https://your-site.atlassian.net/wiki/spaces/SPACE/pages/123456/Legal-Compliance-Checklist
```

### Customer Validation Tracker

1. Enter your Confluence feedback page URL
2. Click "💾 Save Feedback Link"
3. The link is saved for future reference

### Impact Metrics

View real-time metrics displayed in the dashboard (currently static demo data).

## 🏗️ Project Structure

```
DHNext-Launchpad/
├── src/
│   ├── App.jsx                 # Main React UI component
│   └── resolvers/
│       └── index.js            # Backend resolvers (Confluence API, Gemini AI)
├── manifest.yml                # Forge app configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🎨 UI Components

Built with Forge React UI Kit components:
- `Box` - Layout containers with design tokens
- `Stack` - Vertical layouts
- `Inline` - Horizontal layouts
- `Heading` - Typography hierarchy
- `Button` / `ButtonGroup` - Interactive controls
- `SectionMessage` - Feedback notifications
- `Lozenge` - Status badges

## 🔄 Development Workflow

### Making Changes
1. Edit source files in `src/`
2. Run `forge tunnel` for live updates
3. Test in your Jira environment
4. Commit changes to Git

### Deploying Updates
```bash
forge deploy --environment development
forge install --upgrade --environment development
```

### Production Deployment
```bash
forge deploy --environment production
forge install --upgrade --environment production
```

## 🧪 Testing

Test the compliance checker with a sample Confluence page containing items like:
- Privacy Policy
- Terms of Service
- GDPR Compliance
- Data Protection Agreement
- Security Protocols

The AI will automatically categorize and extract status information.

## 🐛 Troubleshooting

### Common Issues

**XCSS Property Warnings**
- These are development-time warnings for unsupported CSS properties
- They don't affect functionality in production
- Safe to ignore: `display: grid`, `cursor: pointer`, `transition`, etc.

**Gemini API Errors**
- Verify API key is correct
- Check egress permissions in `manifest.yml`
- Ensure model name is `gemini-2.0-flash-exp`

**Confluence API 404**
- Verify page ID in URL is correct
- Check read permissions for the Confluence space
- Ensure using Confluence REST API v2 format

## 📝 Version History

- **v9.1.0** - Enhanced UI with proper button rendering and view controls
- **v9.0.0** - Migrated to Google Gemini AI for compliance analysis
- **v8.0.0** - Initial release with regex-based parsing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the DubHacks 2025 hackathon submission.

## 👥 Authors

- **Adam Zhang** - [@adamzzq](https://github.com/adamzzq)

## 🙏 Acknowledgments

- Atlassian Forge platform and documentation
- Google Gemini AI for intelligent document parsing
- DubHacks 2025 for the opportunity

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check Atlassian Forge documentation: https://developer.atlassian.com/platform/forge/

---

Built with ❤️ for DubHacks 2025
