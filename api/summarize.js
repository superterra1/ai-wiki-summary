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
  
  export default async function handler(req, res) {
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
      const { url } = req.body;
  
      if (!url || !url.includes('wikipedia.org/wiki/')) {
        return res.status(400).json({ error: 'Invalid Wikipedia URL' });
      }
  
      // Extract article title from URL
      const articleTitle = url.split('/wiki/')[1].replace(/_/g, ' ');
      
      // Fetch Wikipedia content using Wikipedia API
      const wikiResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(articleTitle)}`
      );
  
      if (!wikiResponse.ok) {
        throw new Error('Failed to fetch Wikipedia article');
      }
  
      const wikiData = await wikiResponse.json();
      
      // Get the full article content for better summarization
      const contentResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(articleTitle)}&prop=extracts&exintro=false&explaintext=true&exsectionformat=plain`
      );
  
      const contentData = await contentResponse.json();
      const pages = contentData.query.pages;
      const pageId = Object.keys(pages)[0];
      const fullContent = pages[pageId]?.extract || wikiData.extract;
  
      if (!fullContent) {
        return res.status(404).json({ error: 'Article content not found' });
      }
  
      // Truncate content for summarization model
      const maxLength = 3000; // Summarization models have smaller input limits
      const content = fullContent.length > maxLength 
        ? fullContent.substring(0, maxLength) + '...'
        : fullContent;
  
      // Generate summary using Hugging Face
      // Try multiple models in case one is overloaded
      const models = [
        'facebook/bart-large-cnn',           // Best for news/articles
        'microsoft/DialoGPT-medium',         // Conversational
        'google/pegasus-xsum'                // Abstractive summarization
      ];
  
      let summary = null;
      let lastError = null;
  
      for (const model of models) {
        try {
          const result = await queryHuggingFace({
            inputs: `Summarize this Wikipedia article about ${articleTitle}:\n\n${content}`,
            parameters: {
              max_length: 200,
              min_length: 50,
              do_sample: false
            }
          }, model);
  
          if (result && result[0] && result[0].summary_text) {
            summary = result[0].summary_text;
            break;
          } else if (result && result[0] && result[0].generated_text) {
            summary = result[0].generated_text;
            break;
          }
        } catch (error) {
          lastError = error;
          console.log(`Model ${model} failed, trying next...`);
          continue;
        }
      }
  
      if (!summary) {
        throw lastError || new Error('All summarization models failed');
      }
  
      return res.status(200).json({
        summary,
        title: articleTitle,
        originalUrl: url
      });
  
    } catch (error) {
      console.error('Error:', error);
      
      if (error.message.includes('API key')) {
        return res.status(500).json({ error: 'API configuration error' });
      }
      
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return res.status(429).json({ error: 'Service temporarily unavailable. Please try again later.' });
      }
  
      return res.status(500).json({ 
        error: error.message || 'Failed to generate summary'
      });
    }
  }