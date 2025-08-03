import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import Exa from 'exa-js';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const jurisdiction = formData.get('jurisdiction') as string || 'CA';
    const caseType = formData.get('caseType') as string || 'EVICTION';

    let combinedText = "";

    for (const file of files) {
      if (file.type === 'application/pdf') {
        const buffer = Buffer.from(await file.arrayBuffer());
        const data = await pdf(buffer);
        combinedText += data.text;
      } else {
        combinedText += await file.text();
      }
    }

    // Truncate if too long
    const maxInputLength = 80000; // Leave more room for multiple prompts
    if (combinedText.length > maxInputLength) {
      combinedText = combinedText.substring(0, maxInputLength) + "\n\n[Text truncated due to length limits]";
    }

    // Initialize Exa for legal research
    const exa = new Exa('cdefabbf-5fa8-4fbf-bf81-a915fa10d8c2');
    
    // Extract key legal terms for research
    const legalSearchTerms = await extractLegalTerms(combinedText, jurisdiction, caseType);
    
    // Perform legal research
    const legalResearch = await performLegalResearch(exa, legalSearchTerms, jurisdiction, caseType);

    // Generate concise legal defense materials with research integration
    const researchContext = legalResearch.map(r => 
      `Research for "${r.term}": ${r.results.map(res => `${res.title} - ${res.text}`).join('; ')}`
    ).join('\n\n');

    const prompts = {
      flashcards: `Create a structured fact pattern from these case documents with legal research context. Format as:

## Case Timeline
**Date** | **Event** | **Significance**

## Parties
**Plaintiff:** [Name and role]
**Defendant:** [Client name and role]
**Key Witnesses:** [If any]

## Financial Details
**Amount Claimed:** $X
**Fees/Costs:** $X
**Client Income:** [If disclosed]

## Key Facts
• Most important fact 1
• Most important fact 2
• [Continue with 8-10 key facts]

## Legal Research Context
${researchContext}

Focus on: Dates, amounts, procedural steps, and legally significant facts. Keep concise and organized.

Case Documents: ${combinedText}`,

      mcq: `Identify and analyze legal issues in these case documents with current legal research. Format as:

## Primary Issues
**Issue 1:** [Legal issue name]
• **Confidence:** High/Medium/Low
• **Legal Basis:** [Statute/regulation]
• **Evidence:** [Supporting facts]
• **Case Law Support:** [From research below]

**Issue 2:** [Next issue]
• **Confidence:** High/Medium/Low
• **Legal Basis:** [Statute/regulation]  
• **Evidence:** [Supporting facts]
• **Case Law Support:** [From research below]

[Continue for 5-8 issues]

## Potential Defenses
• **Procedural:** Service defects, jurisdiction, statute of limitations
• **Substantive:** FDCPA violations, habitability, discriminatory practices
• **Affirmative:** Counterclaims, fee-shifting statutes

## Current Legal Research
${researchContext}

Focus on: Civil defense matters (evictions, debt, wage theft, benefits, immigration). Rate confidence based on strength of evidence and recent case law.

Case Documents: ${combinedText}`,

      summary: `Create a defense strategy checklist from these case documents with current legal precedents. Format as:

## Immediate Actions (0-7 days)
• Review service of process for defects
• Check jurisdiction and venue issues
• Identify statute of limitations problems
• [Add 2-3 more immediate items based on research]

## Discovery & Investigation (1-4 weeks)
• Request documents from opposing party
• Interview client about [specific areas]
• Research applicable defenses
• [Add 2-3 more discovery items]

## Motion Practice (2-6 weeks)
• File motion to dismiss if grounds exist
• Consider counterclaims for [specific violations]
• Request fee-shifting under [applicable statute]
• [Add 1-2 more motions based on case law]

## Settlement Strategy
• Leverage identified violations
• Calculate potential fee awards
• Prepare demand letter highlighting [key issues]

## Legal Precedents & Research
${researchContext}

Focus on: Practical next steps for civil defense cases with current legal precedents. Be specific and actionable.

Case Documents: ${combinedText}`,

      definitions: `Create a deadline calendar from these case documents with jurisdiction-specific rules. Format as:

## Critical Deadlines

**[Date]** - **[Action Required]** 
*Statutory basis: [Citation]*
*Jurisdiction: ${jurisdiction}*

**[Date]** - **[Next Action]**
*Statutory basis: [Citation]*
*Jurisdiction: ${jurisdiction}*

[Continue for all identified deadlines]

## Deadline Calculation Notes
• Answer due: [X] days from service (${jurisdiction} rules)
• Discovery cutoff: [X] days before trial
• Motion deadlines: [Rule/statute reference]
• Appeal window: [X] days from judgment

## Jurisdictional Research
${researchContext}

## Missing Information
• Service date unclear - verify with client
• Court rules may modify standard deadlines
• [Other gaps in timeline]

Focus on: Statutory and court-imposed deadlines for ${jurisdiction} ${caseType} cases. Include basis for each deadline. Flag missing dates that need verification.

Case Documents: ${combinedText}`
    };

    // Helper function with retry logic
    const makeRequest = async (type: string, prompt: string, retryCount = 0): Promise<[string, string]> => {
      try {
        const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY || "YOUR_API_KEY"}`,
          },
          body: JSON.stringify({
            model: "qwen-3-235b-a22b-instruct-2507",
            messages: [
              {
                role: "system",
                content: "You are JusticeJet, a legal AI assistant creating concise defense materials for pro bono attorneys. Generate practical legal analysis tools - fact patterns, issue spotters, defense strategies, and deadline calendars. Follow formatting exactly. Be brief, actionable, and legally focused."
              },
              {
                role: "user",
                content: prompt
              }
            ]
          }),
        });

        if (response.status === 429 && retryCount < 3) {
          // Rate limited, wait and retry
          const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
          console.log(`Rate limited for ${type}, retrying in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          return makeRequest(type, prompt, retryCount + 1);
        }

        if (!response.ok) {
          throw new Error(`Failed to generate ${type}: ${response.status}`);
        }

        const data = await response.json();
        return [type, data.choices[0].message.content];
      } catch (error) {
        if (retryCount < 2) {
          console.log(`Error generating ${type}, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return makeRequest(type, prompt, retryCount + 1);
        }
        throw error;
      }
    };

    // Make sequential requests with delays to avoid rate limits
    const responses: [string, string][] = [];
    const entries = Object.entries(prompts);
    
    for (let i = 0; i < entries.length; i++) {
      const [type, prompt] = entries[i];
      
      try {
        const result = await makeRequest(type, prompt);
        responses.push(result);
        
        // Add delay between requests to respect rate limits
        if (i < entries.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Failed to generate ${type}:`, error);
        // Continue with other requests, use fallback content
        responses.push([type, `## ${type.charAt(0).toUpperCase() + type.slice(1)}\n\nDefense analysis failed. Please try again.`]);
      }
    }

    // Convert responses to object
    const defenseMaterials = Object.fromEntries(responses);

    // Include legal research results in response
    return NextResponse.json({
      ...defenseMaterials,
      legalResearch: legalResearch
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Helper function to extract legal terms for research
async function extractLegalTerms(text: string, jurisdiction: string, caseType: string): Promise<string[]> {
  const baseTerms = [];
  
  // Case type specific terms
  switch (caseType) {
    case 'EVICTION':
      baseTerms.push(
        `${jurisdiction} eviction defense`,
        `${jurisdiction} landlord tenant law`,
        `${jurisdiction} habitability defense`,
        `${jurisdiction} improper service eviction`,
        `${jurisdiction} rent control ordinance`
      );
      break;
    case 'DEBT':
      baseTerms.push(
        `${jurisdiction} debt collection defense`,
        `${jurisdiction} FDCPA violations`,
        `${jurisdiction} debt validation requirements`,
        `${jurisdiction} statute of limitations debt`
      );
      break;
    case 'WAGE':
      baseTerms.push(
        `${jurisdiction} wage theft claims`,
        `${jurisdiction} overtime violations`,
        `${jurisdiction} FLSA defense`,
        `${jurisdiction} employee classification`
      );
      break;
    default:
      baseTerms.push(
        `${jurisdiction} civil defense`,
        `${jurisdiction} consumer protection`,
        `${jurisdiction} legal aid defense`
      );
  }
  
  // Extract specific legal terms from document text
  const legalKeywords = text.match(/\b(statute|section|code|USC|CFR|Cal\.|Civ\.|Code|§)\s*\d+/gi) || [];
  baseTerms.push(...legalKeywords.slice(0, 3)); // Limit to avoid too many searches
  
  return baseTerms.slice(0, 5); // Limit total searches
}

// Helper function to perform legal research
async function performLegalResearch(exa: any, searchTerms: string[], jurisdiction: string, caseType: string) {
  const researchResults = [];
  
  for (const term of searchTerms) {
    try {
      const result = await exa.searchAndContents(term, {
        type: "neural",
        useAutoprompt: true,
        numResults: 2,
        text: true,
        highlights: true,
        includeDomains: [
          "justia.com",
          "findlaw.com", 
          "law.cornell.edu",
          "courtlistener.com",
          "lexisnexis.com",
          "nolo.com",
          "americanbar.org"
        ]
      });

      if (result.results && result.results.length > 0) {
        researchResults.push({
          term,
          results: result.results.map(r => ({
            title: r.title,
            url: r.url,
            text: r.text?.substring(0, 300),
            highlights: r.highlights?.slice(0, 2)
          }))
        });
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error(`Legal research failed for term: ${term}`, error);
    }
  }
  
  return researchResults;
}