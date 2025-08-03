import { NextResponse } from 'next/server';
import Exa from 'exa-js';

export async function POST(req: Request) {
  try {
    const { query, jurisdiction, caseType } = await req.json();
    
    const exa = new Exa('cdefabbf-5fa8-4fbf-bf81-a915fa10d8c2');
    
    // Enhanced search queries for legal research
    const searchQueries = [
      `${query} ${jurisdiction} ${caseType} case law court decision`,
      `${query} statute law ${jurisdiction} civil defense`,
      `${query} legal precedent ${jurisdiction} recent 2023 2024`,
      `${caseType} defense strategy ${jurisdiction} tenant rights eviction`
    ];

    const searchResults = [];

    for (const searchQuery of searchQueries) {
      try {
        const result = await exa.searchAndContents(searchQuery, {
          type: "neural",
          useAutoprompt: true,
          numResults: 3,
          text: true,
          highlights: true,
          includeDomains: [
            "justia.com",
            "findlaw.com", 
            "law.cornell.edu",
            "courtlistener.com",
            "google.com/scholar",
            "lexisnexis.com",
            "westlaw.com",
            "law.com",
            "americanbar.org",
            "nolo.com",
            "avvo.com"
          ]
        });

        if (result.results && result.results.length > 0) {
          searchResults.push({
            query: searchQuery,
            results: result.results.map(r => ({
              title: r.title,
              url: r.url,
              text: r.text?.substring(0, 500) + '...',
              highlights: r.highlights,
              score: r.score
            }))
          });
        }
      } catch (error) {
        console.error(`Search failed for query: ${searchQuery}`, error);
      }
    }

    return NextResponse.json({ 
      searchResults,
      totalResults: searchResults.reduce((acc, curr) => acc + curr.results.length, 0)
    });

  } catch (error) {
    console.error('Legal search error:', error);
    return new NextResponse('Legal search failed', { status: 500 });
  }
}