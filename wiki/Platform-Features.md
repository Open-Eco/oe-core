# OpenEco Platform Features & Requirements

This document captures all current and planned features for the OpenEco climate transparency platform.

## Core Platform Capabilities

### 1. Decarbonization Priority

**Requirement**: Does the software prioritise decarbonisation over offsetting?

**Rationale**: Focusing on decarbonisation ensures long-term emissions reductions, rather than relying heavily on offsets which may not contribute directly to reducing carbon at the source.

**Implementation**:
- Focus on long-term emissions reductions at the source
- Track reduction initiatives and their impact
- Provide tools for identifying and implementing reduction strategies
- Offset tracking is secondary to direct reduction efforts
- Prioritize reduction actions over offset purchases in recommendations

### 2. Comprehensive Scope Coverage

**Requirement**: Can the software track emissions across all emissions Scopes and categories?

**Rationale**: Full Scope 1, 2, and 3 coverage ensures a complete view of your carbon footprint, including both direct and indirect emissions, enabling better reduction strategies.

**Scope 1 (Direct Emissions)**:
- Stationary combustion (fuel, natural gas)
- Mobile combustion (company vehicles)
- Fugitive emissions (refrigerants, methane leaks)
- Process emissions (manufacturing, chemical reactions)

**Scope 2 (Indirect - Energy)**:
- Purchased electricity
- Purchased heating
- Purchased cooling
- Purchased steam

**Scope 3 (Indirect - Value Chain)**:
- Purchased goods and services
- Capital goods
- Fuel and energy-related activities (not in Scope 1 or 2)
- Upstream transportation and distribution
- Waste generated in operations
- Business travel
- Employee commuting
- Upstream leased assets
- Downstream transportation and distribution
- Processing of sold products
- Use of sold products
- End-of-life treatment of sold products
- Downstream leased assets
- Franchises
- Investments

**Categories**:
- Waste
- Water
- Fuel
- Electricity
- Installations (carbon scrubbers, renewable energy systems)
- Marketing (climate initiatives, green campaigns)
- Supply Chain
- Corporate Travel
- Employee Commuting
- Other

### 3. GHG Protocol Compliance

**Requirement**: Is the carbon calculation method certified for compliance with the GHG Protocol (e.g. by TÜV Rheinland)?

**Rationale**: Certification guarantees that the software follows recognised standards, ensuring accuracy and credibility in your carbon reporting.

**Implementation**:
- TÜV Rheinland certification (or equivalent) for calculation methodologies
- Alignment with GHG Protocol Corporate Standard
- Support for multiple emission factor datasets (DEFRA, IPCC, EPA)
- Transparent calculation methodology documentation
- Audit-ready calculation trails

### 4. Comprehensive Data Analysis Tools

**Requirement**: Does the platform provide comprehensive data analysis tools (e.g. custom dashboards)?

**Rationale**: Robust analysis and visualisation tools help track performance, identify trends, and support informed decisions to meet your sustainability goals.

**Dashboard Features**:
- **Emissions by Category**: Pie charts showing breakdown by category
- **Emissions by Product Line**: Breakdown by product/service line
- **Emissions by Product**: Individual product-level analysis
- **Emissions by Activity**: Activity type breakdown
- **Emissions by Supply Chain**: Supplier-level emissions tracking
- **Emissions by Supplier**: Individual supplier analysis
- **T-Chart Analysis**: Spend vs. savings accounting format
  - Negative values displayed in red with dash prefix
  - Positive savings highlighted
  - Net calculations
- **Date Range Selection**: Filter all views by custom date ranges
- **Custom Dashboards**: User-configurable dashboard layouts
- **Custom Scopes**: Define custom emission scopes beyond standard Scope 1/2/3

**Charting Tools**:
- Pie charts (emissions by category)
- Bar charts (comparative analysis)
- Line charts (trends over time)
- Area charts (cumulative emissions)
- T-chart tables (spend analysis)

### 5. API Integration

**Requirement**: Does the platform provide an API to integrate with your existing tools?

**Rationale**: Seamless integration reduces manual data entry, improves accuracy, and ensures that emissions data is regularly updated across all systems.

**API Capabilities**:
- RESTful API for all data operations
- Authentication via API keys or OAuth
- Webhook support for real-time updates
- Bulk data import/export endpoints
- Integration with:
  - ERP systems (SAP, Oracle, Microsoft Dynamics)
  - Financial systems (QuickBooks, Xero)
  - Supply chain management tools
  - Energy management systems
  - Fleet management systems
  - HR systems (for employee data)
  - Travel booking systems
  - Procurement platforms

**API Endpoints** (planned):
- `/api/v1/activity-data` - Create, read, update activity data
- `/api/v1/emissions` - Calculate and retrieve emissions
- `/api/v1/reports` - Generate and retrieve reports
- `/api/v1/organizations` - Organization management
- `/api/v1/facilities` - Facility management
- `/api/v1/suppliers` - Supplier data management
- `/api/v1/dashboards` - Dashboard data retrieval
- `/api/v1/export` - Data export for external systems

### 6. Reduction Action Recommendations

**Requirement**: Does it recommend reduction actions based on your company's emission profile?

**Rationale**: Custom reduction recommendations help focus efforts on the most impactful areas, maximising your emissions reduction potential.

**Features**:
- AI-powered analysis of emission hotspots
- Industry-specific reduction recommendations
- Cost-benefit analysis for reduction initiatives
- Prioritization based on impact and feasibility
- Implementation tracking for recommended actions
- Success metrics and ROI calculations

**Decarbonization Plans**:
- Business travel optimization recommendations
- Energy efficiency improvements
- Supply chain optimization
- Waste reduction strategies
- Renewable energy transition plans
- Process optimization suggestions

### 7. ESG Reporting Support

**Requirement**: Does the software provide additional support for ESG reporting, such as a CSRD module?

**Rationale**: Built-in ESG reporting features ensure compliance with regulatory requirements and make reporting more efficient and transparent.

**Report Types**:
- **Annual Summary Reports**: Year-over-year emissions tracking
- **ESG Reports**: Comprehensive ESG metrics
- **CSRD (Corporate Sustainability Reporting Directive)**: EU compliance reporting
- **TCFD (Task Force on Climate-related Financial Disclosures)**: Climate risk reporting
- **CDP (Carbon Disclosure Project)**: Standardized disclosure format
- **GRI (Global Reporting Initiative)**: Sustainability reporting standards

**Report Formats**:
- PDF generation
- DOCX export
- Excel/CSV export
- JSON/XML for API integration
- HTML for web publishing

**Report Features**:
- Customizable templates
- Automated report generation
- Scheduled report delivery
- Multi-format export
- Audit-ready documentation

### 8. Educational Content & Insights

**Requirement**: Does the provider share educational content through expert sessions and in-platform insights?

**Rationale**: Ongoing learning and insights inform your team about best practices, helping you optimise software usage and stay updated on industry trends.

**Features**:
- In-platform knowledge base
- Best practices guides
- Industry-specific insights
- Expert webinar series
- Case studies and success stories
- Regulatory updates and compliance guidance
- Calculation methodology explanations
- Data quality improvement tips

### 9. User-Friendly Interface

**Requirement**: Is the platform's interface user-friendly and intuitive?

**Rationale**: A simple, intuitive interface encourages user adoption and ensures that teams can work efficiently without extensive training.

**Design Principles**:
- Clean, modern interface using EcoKit design system
- Intuitive navigation
- Contextual help and tooltips
- Responsive design (mobile, tablet, desktop)
- Accessibility compliance (WCAG 2.1 AA)
- Minimal training required
- Clear data visualization
- Consistent UI patterns

### 10. Personalized Expert Support

**Requirement**: Is personalised expert support available to help with your company's specific requirements?

**Rationale**: Tailored expert support helps address specific challenges, ensuring the software meets your unique sustainability needs.

**Support Features**:
- Dedicated account management
- Implementation support
- Custom configuration assistance
- Data migration help
- Training sessions
- Best practices consulting
- Compliance guidance
- Technical support

### 11. Industry Establishment & References

**Requirement**: Is the software provider well-established in the industry and backed by customer references?

**Rationale**: A proven track record and strong customer references demonstrate reliability and successful implementation across other businesses.

**Credibility Indicators**:
- Open-source transparency
- Active community
- Real-world deployments
- Customer testimonials
- Case studies
- Industry partnerships
- Academic collaborations

### 12. Provider Sustainability Commitment

**Requirement**: Is the provider committed to its own sustainability practices, such as B-Corp certification?

**Rationale**: Providers with strong sustainability commitments ensure alignment with your values and enhance the credibility of your efforts.

**Commitments**:
- Open-source, nonprofit model
- Transparent operations
- Sustainable hosting practices
- Carbon-neutral operations (where possible)
- Ethical business practices
- Community-driven development

## Advanced Features

### Greenhouse Gas Coverage

**Beyond Carbon**:
- **Methane (CH₄)**: Track methane emissions from:
  - Natural gas leaks
  - Agricultural activities
  - Waste decomposition (landfills)
  - Energy production
- **Nitrous Oxide (N₂O)**: Track from:
  - Agricultural processes
  - Industrial processes
  - Combustion
- **Fluorinated Gases (F-gases)**:
  - HFCs (hydrofluorocarbons)
  - PFCs (perfluorocarbons)
  - SF₆ (sulfur hexafluoride)
  - NF₃ (nitrogen trifluoride)
- **Other Byproducts**:
  - Particulate matter
  - Sulfur oxides (SOₓ)
  - Nitrogen oxides (NOₓ)
  - Volatile organic compounds (VOCs)

**Conversion to CO₂e**:
- Global Warming Potential (GWP) factors for all GHGs
- Automatic conversion to CO₂ equivalent
- Support for different GWP time horizons (20-year, 100-year)

### Employee & Commute Tracking

**Employee Categories**:
- 1-50 employees
- 51-200 employees
- 201-1000 employees
- 1001-5000 employees
- 5000+ employees

**Commute Data**:
- Average commute distance per employee
- Commute mode breakdown (car, public transit, bike, walk, remote)
- Regional variations
- Fuel consumption for employee vehicles
- Public transit emissions

### Forecasting & Predictive Analytics

**Requirement**: Research and implement algorithms for forecasting.

**Forecasting Capabilities**:
- **Time Series Analysis**: Historical trend projection
- **Machine Learning Models**: Predictive emissions modeling
- **Scenario Planning**: What-if analysis for different strategies
- **Regulatory Forecasting**: Anticipate future compliance requirements
- **Budget Forecasting**: Cost projections for reduction initiatives
- **Target Setting**: Science-based targets (SBTi) alignment

**Algorithms to Research**:
- ARIMA (AutoRegressive Integrated Moving Average)
- LSTM (Long Short-Term Memory) neural networks
- Prophet (Facebook's forecasting tool)
- Exponential smoothing
- Regression analysis
- Monte Carlo simulation for uncertainty

### Breakdowns & Analysis

**Multi-Dimensional Analysis**:
- **By Product Line**: Emissions per product/service category
- **By Product**: Individual product carbon footprint
- **By Activity**: Activity type breakdown
- **By Supply Chain**: Supplier network analysis
- **By Supplier**: Individual supplier contributions
- **By Facility**: Location-based analysis
- **By Time Period**: Monthly, quarterly, annual views
- **By Scope**: Scope 1, 2, 3 breakdowns
- **By Category**: Waste, water, fuel, electricity, etc.

### Custom Dashboards

**Features**:
- Drag-and-drop dashboard builder
- Customizable widgets
- Saved dashboard templates
- Role-based dashboard views
- Real-time data updates
- Export dashboard data
- Share dashboards with team members

### Custom Scopes

**Features**:
- Define organization-specific emission scopes
- Beyond standard Scope 1/2/3
- Industry-specific categorization
- Custom calculation methodologies
- Flexible reporting structures

## Future Trends & Roadmap

### AI Integration

**Future Trend**: Advanced AI integrations will enable more accurate forecasting of emissions, real-time tracking, and predictive analytics for decarbonisation strategies. These capabilities will help businesses anticipate regulatory changes and adapt proactively.

**Planned Capabilities**:
- **Advanced Forecasting**: AI-powered emissions prediction
- **Real-Time Tracking**: Automated data collection and processing
- **Predictive Analytics**: Anticipate emissions trends and regulatory changes
- **Anomaly Detection**: Identify data quality issues automatically
- **Natural Language Processing**: Query data using conversational interface
- **Automated Recommendations**: AI-driven reduction strategies
- **Smart Data Entry**: OCR and AI-assisted data extraction from invoices, receipts

### Sector-Specific Customization

**Future Trend**: Future tools will offer more industry-specific modules to address unique challenges, such as those faced by energy-intensive sectors like manufacturing or aviation.

**Industry Modules**:
- **Manufacturing**: Process emissions, energy-intensive operations
- **Aviation**: Flight emissions, fuel consumption
- **Retail**: Supply chain, logistics, store operations
- **Technology**: Data centers, cloud computing, e-waste
- **Agriculture**: Livestock, crop production, land use
- **Construction**: Materials, transportation, on-site operations
- **Healthcare**: Medical waste, energy consumption, supply chain
- **Financial Services**: Business travel, office operations, investments

### Enhanced Collaboration Features

**Future Trend**: As Scope 3 emissions gain prominence, carbon accounting software will prioritize collaboration between suppliers, customers, and stakeholders to provide a holistic view of emissions throughout the value chain.

**Scope 3 Focus**:
- **Supplier Portal**: Allow suppliers to input their own emissions data
- **Customer Collaboration**: Share emissions data with customers
- **Stakeholder Engagement**: Transparent reporting to investors, regulators
- **Value Chain Mapping**: Visualize entire supply chain emissions
- **Collaborative Reduction Initiatives**: Joint projects with suppliers/partners
- **Data Sharing Standards**: Interoperability with other platforms

### Financial System Integration

**Future Trend**: Carbon accounting tools will increasingly integrate with ERP and financial software to align sustainability metrics with financial performance, allowing businesses to measure the ROI of their sustainability initiatives more effectively.

**ERP & Financial Software Integration**:
- **SAP Integration**: Direct data flow from SAP systems
- **Oracle Integration**: ERP data synchronization
- **Microsoft Dynamics**: Seamless integration
- **QuickBooks/Xero**: Financial data correlation
- **ROI Measurement**: Calculate financial returns on sustainability initiatives
- **Cost Allocation**: Link emissions to cost centers
- **Budget Tracking**: Track sustainability spending
- **Carbon Pricing**: Internal carbon pricing integration

## Data Model Enhancements

### Additional Categories to Support

- **Corporate Travel**: Business flights, hotels, ground transportation
- **Employee Commuting**: Commute distance, mode of transport
- **Employee Count Ranges**: 1-50, 51-200, 201-1000, 1001-5000, 5000+
- **Average Commute Distance**: Per employee or regional average
- **Methane Tracking**: Separate tracking for methane emissions
- **Other GHGs**: N₂O, F-gases, other byproducts

### Database Schema Considerations

- Support for multiple GHG types (not just CO₂)
- Employee demographic data
- Commute pattern tracking
- Product/service line associations
- Supplier relationship mapping
- Custom scope definitions
- Forecasting model parameters
- Reduction initiative tracking

## Competitive Differentiation

**OpenEco's strategic wedge**: Be the **system of proof**, not just system of record.

| Paid Platform Approach | OpenEco Approach |
|------------------------|------------------|
| Proprietary calculations | Transparent, reproducible methods |
| Lock-in via integrations | Interoperability-first API |
| Certification badges | Public verification artifacts |
| Trust via brand | Trust via transparency |

See [COMPETITIVE_ANALYSIS.md](./COMPETITIVE_ANALYSIS.md) for full competitive research.  
See [OPEN_SOURCE_PLAYBOOK.md](./OPEN_SOURCE_PLAYBOOK.md) for governance, auditability, and factor management implementation details.

---

## Implementation Priority

### Phase 1 (Current)
- ✅ Basic activity data entry
- ✅ Organization and facility management
- ✅ Dashboard with charts (pie chart, T-chart)
- ✅ Basic emissions calculation
- ✅ Demo mode with sessionStorage

### Phase 2 (Near-term) - Credibility Spine
- [ ] Factor library + versioning (DEFRA, IPCC, EPA datasets)
- [ ] Calculation detail drawer (factor source, version, GWP set)
- [ ] Evidence attachments per activity
- [ ] Approval workflow (Draft → Submitted → Approved → Locked)
- [ ] Audit log for all state changes
- [ ] Exports (CSV/JSON + audit pack zip)
- [ ] Full Scope 1/2/3 coverage
- [ ] Report generation (PDF, DOCX)
- [ ] Date range filtering
- [ ] API endpoints

### Phase 3 (Medium-term) - Platform Differentiation
- [ ] Data quality scoring (coverage %, anomaly detection)
- [ ] Public verification artifacts (QR/shareable link for frozen results)
- [ ] Scope 2 dual reporting (location-based + market-based)
- [ ] REC/EAC/GO tracking for renewable instruments
- [ ] GHG Protocol conformance documentation
- [ ] Multiple GHG tracking (methane, N₂O, F-gases)
- [ ] Forecasting algorithms
- [ ] Reduction recommendations
- [ ] Financial system integrations

### Phase 4 (Long-term) - Big Value Features
- [ ] Scenario analysis (what-if planning)
- [ ] Reduction project tracking + ROI
- [ ] Supplier portal / surveys (Scope 3 collaboration)
- [ ] Framework reporting packs (CSRD, TCFD, CDP, GRI)
- [ ] AI integration (forecasting, recommendations, NLQ)
- [ ] Sector-specific modules
- [ ] Expert support platform
- [ ] Educational content hub

---

**Last Updated**: 2024  
**Status**: Living document - updated as features are implemented

---

**Related Documents**:
- [COMPETITIVE_ANALYSIS.md](./COMPETITIVE_ANALYSIS.md) - Competitive landscape and UI patterns
- [OPEN_SOURCE_PLAYBOOK.md](./OPEN_SOURCE_PLAYBOOK.md) - Governance, auditability, factor management implementation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture and deployment

