# JusticeJet

**From intake to action in 60 seconds. AI-powered legal defense platform for pro bono attorneys.**

## 🚀 Mission: Do More Good Per Hour

Turn hours of case prep into seconds of AI-powered analysis. Help pro bono attorneys fight evictions, wage theft, and debt collection with lightning-fast defense strategies.

JusticeJet is built for legal aid heroes handling high-volume civil matters where every minute counts and every case matters.

![JusticeJet Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-06B6D4)

## ⚖️ Features

### 🏛️ **Legal Defense Command Center**
- **Auto-generated case IDs** for instant case tracking
- **Jurisdiction-specific analysis** (CA, NY, TX, Federal)
- **Case type optimization** (Evictions, Debt Collection, Wage & Hour, Immigration, Benefits)
- **Professional legal brief styling** with navy/gold theme

### ⚡ **Ultra-Fast Case Analysis**
- **Powered by Cerebras AI** at 2,000 tokens/sec
- **Complete analysis in <10 seconds**
- **Real-time progress tracking** with live updates
- **PDF and text document processing** with intelligent extraction

### 🔍 **Real-Time Legal Research**
- **Live case law lookup** during document analysis
- **Statute verification** and jurisdictional rules
- **Exa AI integration** for comprehensive legal research
- **Authoritative sources** (Justia, FindLaw, Cornell Law, CourtListener)

### 📋 **Comprehensive Defense Materials**
- **Case Facts & Timeline** - Structured chronology with key events
- **Legal Issues Analysis** - Identified problems with confidence ratings
- **Defense Strategies** - Actionable checklists and motion practice
- **Critical Deadlines** - Jurisdiction-specific filing requirements

### 🛡️ **Pro Bono Focused**
- **Eviction Defense** - Service defects, habitability, payment plans
- **Debt Collection** - FDCPA violations, validation requirements, SOL
- **Wage & Hour** - FLSA violations, overtime calculations, classifications
- **Immigration & Benefits** - Specialized defense strategies

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Cerebras API key
- Exa API key (for legal research)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/justicejet.git
   cd justicejet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your API keys:
   ```bash
   CEREBRAS_API_KEY=your_cerebras_api_key
   EXA_API_KEY=your_exa_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📖 Usage

### Basic Workflow

1. **Case Intake**
   - Auto-generated case ID (CASE-XXXXXX)
   - Select jurisdiction (CA, NY, TX, Federal)
   - Choose case type (Eviction, Debt, Wage, Immigration, Benefits)

2. **Document Upload**
   - Drag & drop legal documents (complaints, notices, contracts)
   - Supports PDF and text files
   - Choose analysis depth (Quick, Standard, Deep Dive)

3. **AI Analysis**
   - Real-time progress tracking with live updates
   - Cerebras AI processes at 2,000 tokens/sec
   - Exa conducts live legal research
   - Cross-references current case law and statutes

4. **Defense Materials**
   - **Case Facts**: Timeline, parties, financial details
   - **Legal Issues**: Confidence-rated problems and defenses
   - **Strategy**: Immediate actions, discovery, motion practice
   - **Deadlines**: Critical dates with statutory basis

5. **Export & Action**
   - PDF export for court filings
   - Ready-to-edit defense strategies
   - Client-safe explanations

## 🏗️ Technology Stack

### Frontend
- **Next.js 15.4.5** - React framework with App Router
- **TypeScript** - Type safety for legal precision
- **Tailwind CSS 4.0** - Professional legal styling
- **Radix UI** - Accessible component library
- **FK Grotesk Font** - Professional legal typography

### AI & Legal Research
- **Cerebras AI** - Ultra-fast inference with Qwen-3-235B model
- **Exa AI** - Real-time legal research and case law lookup
- **PDF-Parse** - Legal document text extraction
- **React Markdown** - Formatted legal analysis rendering

### Legal-Specific Features
- **Jurisdiction-aware prompts** - State-specific legal analysis
- **Case type optimization** - Specialized for civil defense matters
- **Legal citation parsing** - Automatic statute and case law recognition
- **Deadline computation** - Jurisdiction-specific filing requirements

## 🎯 Target Users

### Pro Bono Attorneys
- **Legal Aid Organizations** handling high-volume cases
- **Civil Rights Lawyers** fighting systemic issues
- **Immigration Attorneys** with resource constraints
- **Tenant Rights Advocates** preventing unlawful evictions

### Case Types
- **Eviction Defense** - Improper service, habitability, discrimination
- **Debt Collection** - FDCPA violations, debt validation, fee-shifting
- **Wage & Hour** - Overtime violations, misclassification, unpaid wages
- **Benefits Appeals** - Social Security, unemployment, healthcare
- **Immigration** - Removal defense, asylum, family reunification

## ⚙️ Configuration

### Environment Variables
```bash
CEREBRAS_API_KEY=your_cerebras_api_key
EXA_API_KEY=your_exa_api_key
```

### Jurisdictional Customization
Add new jurisdictions in `page.tsx`:
```typescript
<SelectItem value="FL">Florida</SelectItem>
<SelectItem value="IL">Illinois</SelectItem>
```

Update legal research terms in `generate-learning/route.ts`:
```typescript
case 'FL':
  baseTerms.push(
    `${jurisdiction} eviction defense`,
    `${jurisdiction} landlord tenant act`
  );
```

## 🔧 API Reference

### POST `/api/generate`
Generate comprehensive legal defense analysis

**Body**: FormData
- `files`: File[] - Legal documents to analyze
- `jurisdiction`: string - Legal jurisdiction ("CA", "NY", "TX", "FEDERAL")
- `caseType`: string - Type of case ("EVICTION", "DEBT", "WAGE", etc.)

### POST `/api/generate-learning`
Generate defense materials with legal research

**Response**:
```json
{
  "flashcards": "Case facts and timeline",
  "mcq": "Legal issues analysis with case law support",
  "summary": "Defense strategies with precedents",
  "definitions": "Critical deadlines with jurisdictional rules",
  "legalResearch": [
    {
      "term": "CA eviction defense",
      "results": [
        {
          "title": "Recent Case Law Updates",
          "url": "https://justia.com/...",
          "text": "Latest precedents...",
          "highlights": ["key legal points"]
        }
      ]
    }
  ]
}
```

### POST `/api/legal-search`
Trigger additional real-time legal research

**Body**: JSON
- `query`: string - Legal search query
- `jurisdiction`: string - Legal jurisdiction
- `caseType`: string - Type of case

## 📁 Project Structure

```
justicejet/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/          # Main legal analysis
│   │   │   ├── generate-learning/ # Defense materials + research
│   │   │   └── legal-search/      # Additional Exa research
│   │   ├── globals.css            # Legal theme + styling
│   │   ├── layout.tsx             # Root layout with fonts
│   │   └── page.tsx               # Legal command center UI
│   ├── components/
│   │   └── ui/                    # Legal-themed UI components
│   └── lib/
│       └── utils.ts               # Legal utility functions
├── public/
│   └── fk-grotesk.woff2          # Professional legal font
└── package.json
```

## 🤝 Contributing

### For Legal Professionals
- **Case Type Expansion** - Add new practice areas
- **Jurisdictional Coverage** - Expand to new states/federal circuits
- **Legal Template Improvement** - Enhance defense strategies
- **Citation Standards** - Improve legal citation parsing

### For Developers
- **Performance Optimization** - Faster document processing
- **UI/UX Enhancement** - Better attorney workflows
- **API Integrations** - Additional legal research sources
- **Security Hardening** - Client confidentiality protection

## 🛡️ Security & Ethics

### Client Confidentiality
- **No data persistence** - Documents processed in memory only
- **Secure API calls** - Encrypted transmission to AI providers
- **Privacy by design** - No client information stored

### Ethical AI Use
- **Attorney supervision required** - All outputs need legal review
- **Not legal advice** - Tool for licensed attorneys only
- **Transparency** - All AI-generated content clearly marked
- **Bias mitigation** - Diverse training data and prompt engineering

## 📄 Legal Disclaimer

**FOR LICENSED ATTORNEYS ONLY**: JusticeJet is designed for legal professionals. All outputs require attorney review and verification. This tool does not provide legal advice and is not a substitute for professional legal judgment.

Demo uses synthetic/redacted documents for privacy protection.

## 📊 Impact Metrics

- **180x faster** case analysis (3 hours → 10 seconds)
- **$0 cost** to families in need
- **Infinite impact** on communities fighting injustice

## 🙏 Acknowledgments

- **Cerebras AI** for ultra-fast legal inference
- **Exa AI** for comprehensive legal research capabilities
- **Pro bono attorneys** fighting for justice every day
- **Legal aid organizations** serving communities in need

---

**Built by advocates, for advocates. ⚖️**

*Justice shouldn't wait. When the system is stacked against your clients, speed becomes justice.*