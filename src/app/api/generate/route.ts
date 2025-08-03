import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const pageLimit = formData.get('pageLimit') as string;

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

    // With Qwen 3 235B having 131K context, we can handle much larger documents
    const maxInputLength = 100000; // Conservative limit to leave room for system prompt and response
    if (combinedText.length > maxInputLength) {
      combinedText = combinedText.substring(0, maxInputLength) + "\n\n[Text truncated due to length limits]";
    }

    const cerebrasResponse = await fetch("https://api.cerebras.ai/v1/chat/completions", {
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
            content: `You are JusticeJet, an AI legal assistant specializing in pro bono civil defense for evictions, wage theft, debt collection, benefits appeals, and immigration matters.

Your role: Transform uploaded client documents into a comprehensive Rapid Defense Pack containing actionable legal analysis and defense strategies.

CRITICAL FORMATTING REQUIREMENTS:
- Start directly with analysis - NO introductory text or meta-commentary
- Use clear, professional legal language appropriate for attorneys
- Structure content with proper headings (##, ###)
- Include case law citations where relevant
- Use bullet points, numbered lists, and tables for clarity
- Focus on practical, actionable defense strategies

CONTENT STRUCTURE:
## Case Overview
- Client information and case type
- Timeline of key events
- Parties involved
- Financial details and deadlines

## Legal Issues Analysis
- Primary legal issues identified
- Confidence level for each issue (High/Medium/Low)
- Applicable statutes and regulations
- Relevant case law precedents

## Defense Strategy
- Procedural defenses (service issues, jurisdiction, etc.)
- Substantive defenses (FDCPA violations, habitability, etc.)
- Affirmative defenses available
- Fee-shifting opportunities

## Next Steps & Deadlines
- Statutory deadlines with dates
- Procedural requirements
- Discovery recommendations
- Motion filing suggestions

## Draft Documents
- Answer/motion templates
- Demand letter suggestions
- Discovery outline

FORBIDDEN:
- No generic legal disclaimers
- No "This is not legal advice" statements
- No academic legal theory - focus on practical defense
- No excessive case citations - be selective and relevant`
          },
          {
            role: "user",
            content: `Analyze the following client case documents and generate a comprehensive ${pageLimit === '10' ? 'Quick Review' : pageLimit === '25' ? 'Standard Analysis' : 'Comprehensive Defense'} Rapid Defense Pack. Focus on civil matters including evictions, wage theft, debt collection, benefits appeals, and immigration. Provide practical defense strategies and identify deadlines.

Client Case Documents:
${combinedText}`
          }
        ]
      }),
    });

    if (!cerebrasResponse.ok) {
      const errorText = await cerebrasResponse.text();
      console.error('Cerebras API Error:', cerebrasResponse.status, errorText);
      throw new Error(`Failed to generate content from Cerebras: ${cerebrasResponse.status} - ${errorText}`);
    }

    const cerebrasData = await cerebrasResponse.json();
    const content = cerebrasData.choices[0].message.content;

    return NextResponse.json({
      content: content,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
