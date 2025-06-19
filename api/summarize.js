// api/summarize.js 

async function queryHuggingFace(data, model) {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Hugging Face API error: ${error}`);
    }
    
    return response.json();
  }
  
  function getSummaryParameters(length) {
    const params = {
      short: { max_length: 100, min_length: 30 },
      medium: { max_length: 200, min_length: 80 },
      long: { max_length: 300, min_length: 150 }
    };
    
    return params[length] || params.short;
  }
  
  async function fetchWikipediaContent(url) {
    try {
      // Extract article title from URL
      const articleTitle = decodeURIComponent(url.split('/wiki/')[1].replace(/_/g, ' '));
      
      // Fetch Wikipedia content using Wikipedia API
      const wikiResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(articleTitle)}`
      );
  
      if (!wikiResponse.ok) {
        if (wikiResponse.status === 404) {
          throw new Error(`Article "${articleTitle}" not found`);
        }
        throw new Error(`Failed to fetch article "${articleTitle}"`);
      }
  
      const wikiData = await wikiResponse.json();
      
      // Get the full article content for better summarization
      const contentResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(articleTitle)}&prop=extracts&exintro=false&explaintext=true&exsectionformat=plain`
      );
  
      const contentData = await contentResponse.json();
      const pages = contentData.query.pages;
      const pageId = Object.keys(pages)[0];
      
      if (pageId === '-1') {
        throw new Error(`Article "${articleTitle}" not found`);
      }
      
      const fullContent = pages[pageId]?.extract || wikiData.extract;
  
      if (!fullContent) {
        throw new Error(`Content for "${articleTitle}" is empty`);
      }
  
      return {
        title: articleTitle,
        content: fullContent,
        url: url
      };
    } catch (error) {
      console.error(`Error fetching content for ${url}:`, error.message);
      throw error;
    }
  }
  
  async function generateSummary(content, title, summaryParams) {
    // Truncate content for summarization model
    const maxInputLength = 4000;
    const truncatedContent = content.length > maxInputLength 
      ? content.substring(0, maxInputLength) + '...'
      : content;
  
    // Generate summary using Hugging Face
    const models = [
      'facebook/bart-large-cnn',
      'microsoft/DialoGPT-medium',
      'google/pegasus-xsum',
      't5-base'
    ];
  
    let summary = null;
    let lastError = null;
  
    for (const model of models) {
      try {
        // Create enhanced prompts for better structured summaries
        const isMultipleArticles = title.includes(',');
        let promptText;
        
        if (isMultipleArticles) {
          promptText = `Create a comprehensive, well-structured summary of these Wikipedia articles: ${title}. 

Structure your response with these sections:
## Overview
Provide a brief introduction connecting all topics

## Key Concepts
List the main concepts and their definitions

## Relationships & Connections
Explain how these topics relate to each other

## Important Details
Include significant facts, dates, people, or processes

## Significance
Explain why these topics are important or relevant

Content to summarize:
${truncatedContent}

Please write in clear, accessible language and organize the information logically.`;
        } else {
          promptText = `Create a comprehensive, well-structured summary of this Wikipedia article about ${title}.

Structure your response with these sections:
## Overview
Brief introduction to the topic

## Key Points
Main facts, concepts, or characteristics

## Background & Context
Historical context, origins, or development

## Important Details
Significant facts, figures, people, or processes mentioned

## Significance & Impact
Why this topic is important or its relevance today

Content to summarize:
${truncatedContent}

Please write in clear, accessible language with specific details and examples where relevant.`;
        }
        
        const result = await queryHuggingFace({
          inputs: promptText,
          parameters: {
            max_length: Math.max(summaryParams.max_length * 2, 400), // Increase for structured content
            min_length: Math.max(summaryParams.min_length * 1.5, 150),
            do_sample: true,
            temperature: 0.4,
            repetition_penalty: 1.2,
            length_penalty: 1.0
          }
        }, model);
  
        if (result && result[0]) {
          if (result[0].summary_text) {
            summary = result[0].summary_text;
            break;
          } else if (result[0].generated_text) {
            let generatedText = result[0].generated_text;
            // Clean up the generated text
            const summaryStart = generatedText.toLowerCase().indexOf('overview');
            if (summaryStart !== -1) {
              generatedText = generatedText.substring(summaryStart - 3).trim();
            }
            summary = generatedText;
            break;
          }
        }
      } catch (error) {
        lastError = error;
        continue;
      }
    }
  
    if (!summary) {
      // Fallback: create a basic structured summary from the content
      console.log('All AI models failed, creating fallback structured summary...');
      summary = createFallbackStructuredSummary(truncatedContent, title, isMultipleArticles);
    }
  
    // Post-process the summary for better structure
    summary = enhanceSummaryStructure(summary, title);
    
    return summary;
  }
  
  function createFallbackStructuredSummary(content, title, isMultiple) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const topSentences = sentences.slice(0, Math.min(8, sentences.length));
    
    if (isMultiple) {
      return `## Overview\n${title.split(', ').join(' and ')} are interconnected topics with significant relevance.\n\n## Key Points\n${topSentences.slice(0, 4).map(s => `• ${s.trim()}.`).join('\n')}\n\n## Important Details\n${topSentences.slice(4, 8).map(s => `• ${s.trim()}.`).join('\n')}\n\n## Significance\nThese topics represent important areas of knowledge with practical applications and historical significance.`;
    } else {
      return `## Overview\n${title} is a significant topic with multiple important aspects.\n\n## Key Points\n${topSentences.slice(0, 3).map(s => `• ${s.trim()}.`).join('\n')}\n\n## Background & Context\n${topSentences.slice(3, 5).map(s => `• ${s.trim()}.`).join('\n')}\n\n## Important Details\n${topSentences.slice(5, 8).map(s => `• ${s.trim()}.`).join('\n')}\n\n## Significance & Impact\nThis topic has considerable importance in its field and continues to be relevant today.`;
    }
  }
  
  function enhanceSummaryStructure(summary, title) {
    // Clean up the summary
    summary = summary.replace(/^\s*Summary:?\s*/i, '').trim();
    
    // Ensure proper section formatting
    summary = summary.replace(/^([A-Z][A-Za-z\s&]+)$/gm, '## $1');
    summary = summary.replace(/^(\*\*[^*]+\*\*)/gm, '## $1');
    
    // Convert bullet points to proper format
    summary = summary.replace(/^[-*•]\s*/gm, '• ');
    
    // Ensure paragraphs are properly separated
    summary = summary.replace(/\n\n\n+/g, '\n\n');
    
    // Add title if not present
    if (!summary.includes('##') && !summary.includes(title)) {
      summary = `## Overview\n${summary}`;
    }
    
    return summary;
  }
  
  async function handleMultipleUrls(req, res) {
    try {
      const { urls, length = 'short' } = req.body;
  
      if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({ 
          error: 'Please provide an array of Wikipedia URLs.' 
        });
      }
  
      if (urls.length > 10) {
        return res.status(400).json({ 
          error: 'Maximum 10 URLs allowed per request.' 
        });
      }
  
      // Validate all URLs
      const invalidUrls = urls.filter(url => !url.includes('wikipedia.org/wiki/'));
      if (invalidUrls.length > 0) {
        return res.status(400).json({ 
          error: `Invalid Wikipedia URLs found: ${invalidUrls.length} URLs are not valid Wikipedia articles.` 
        });
      }
  
      const summaryParams = getSummaryParameters(length);
      const articles = [];
      const failedUrls = [];
  
      // Fetch content for all URLs
      console.log(`Fetching content for ${urls.length} articles...`);
      
      for (const url of urls) {
        try {
          const article = await fetchWikipediaContent(url);
          articles.push(article);
          console.log(`Successfully fetched: ${article.title}`);
        } catch (error) {
          console.error(`Failed to fetch ${url}:`, error.message);
          failedUrls.push({ url, error: error.message });
        }
      }
  
      if (articles.length === 0) {
        return res.status(404).json({ 
          error: 'No articles could be retrieved. Please check your URLs and try again.' 
        });
      }
  
      // Combine all content
      const combinedContent = articles.map(article => {
        return `## ${article.title}\n\n${article.content}`;
      }).join('\n\n---\n\n');
  
      console.log(`Combined content length: ${combinedContent.length} characters`);
  
      // Generate a unified summary
      const combinedTitle = articles.map(a => a.title).join(', ');
      
      // For multiple articles, we need a longer summary to cover all topics
      const multiSummaryParams = {
        max_length: Math.min(summaryParams.max_length * 1.5, 500),
        min_length: Math.max(summaryParams.min_length * 1.2, 100)
      };
  
      let unifiedSummary;
      try {
        // Try to generate a unified summary
        unifiedSummary = await generateSummary(combinedContent, combinedTitle, multiSummaryParams);
      } catch (error) {
        console.error('Failed to generate unified summary:', error.message);
        
        // Fallback: Generate individual summaries and combine them
        console.log('Falling back to individual summaries...');
        const individualSummaries = [];
        
        for (const article of articles) {
          try {
            const summary = await generateSummary(article.content, article.title, summaryParams);
            individualSummaries.push(`**${article.title}:** ${summary}`);
          } catch (err) {
            console.error(`Failed to summarize ${article.title}:`, err.message);
            individualSummaries.push(`**${article.title}:** Unable to generate summary.`);
          }
        }
        
        unifiedSummary = individualSummaries.join('\n\n');
      }
  
      const response = {
        summary: unifiedSummary,
        titles: articles.map(a => a.title),
        urls: articles.map(a => a.url),
        successCount: articles.length,
        totalCount: urls.length,
        length: length,
        wordCount: unifiedSummary.split(/\s+/).length
      };
  
      if (failedUrls.length > 0) {
        response.warnings = failedUrls.map(f => f.error);
      }
  
      return res.status(200).json(response);
  
    } catch (error) {
      console.error('Error in handleMultipleUrls:', error);
      
      if (error.message.includes('API key')) {
        return res.status(500).json({ 
          error: 'AI service configuration error. Please contact support.' 
        });
      }
      
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return res.status(429).json({ 
          error: 'AI service temporarily overloaded. Please try again in a few moments.' 
        });
      }
  
      return res.status(500).json({ 
        error: error.message || 'An unexpected error occurred while processing multiple articles.'
      });
    }
  }
  
  async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { url, length = 'short' } = req.body;
  
      if (!url || !url.includes('wikipedia.org/wiki/')) {
        return res.status(400).json({ 
          error: 'Invalid Wikipedia URL. Please provide a valid Wikipedia article URL.' 
        });
      }
  
      const summaryParams = getSummaryParameters(length);
      
      // Fetch the article content
      const article = await fetchWikipediaContent(url);
      
      // Generate summary
      const summary = await generateSummary(article.content, article.title, summaryParams);
  
      return res.status(200).json({
        summary,
        title: article.title,
        originalUrl: url,
        length: length,
        wordCount: summary.split(/\s+/).length
      });
  
    } catch (error) {
      console.error('Error:', error);
      
      if (error.message.includes('API key')) {
        return res.status(500).json({ 
          error: 'AI service configuration error. Please contact support.' 
        });
      }
      
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return res.status(429).json({ 
          error: 'AI service temporarily overloaded. Please try again in a few moments.' 
        });
      }
      
      if (error.message.includes('timeout')) {
        return res.status(408).json({ 
          error: 'Request timed out. Please try again with a shorter article.' 
        });
      }
  
      return res.status(500).json({ 
        error: error.message || 'An unexpected error occurred while generating the summary.'
      });
    }
  }

  module.exports = { 
    default: handler,
    handleMultipleUrls: handleMultipleUrls
  };