# AI Wikipedia Summarizer

A simple tool that uses AI to generate intelligent summaries of Wikipedia articles.

## Quick Start

1. **Clone/Download** these files to a folder
2. **Get OpenAI API Key** from https://platform.openai.com/api-keys
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create environment file:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your OpenAI API key
   ```
5. **Run locally:**
   ```bash
   npm run dev
   ```
6. **Deploy to Vercel:**
   ```bash
   npm run deploy
   ```

## How it works

1. User pastes a Wikipedia URL
2. Backend fetches article content using Wikipedia API
3. OpenAI generates an intelligent summary
4. User gets the summary and can copy it

## File Structure

```
├── index.html          # Frontend interface
├── api/
│   └── summarize.js    # Backend API endpoint
├── package.json        # Dependencies
├── .env.local         # Environment variables (create this)
└── README.md          # This file
```

## Features

- ✅ Clean, modern interface
- ✅ Fast Wikipedia content fetching
- ✅ AI-powered summarization
- ✅ Copy to clipboard
- ✅ Error handling
- ✅ Mobile responsive

## Cost Estimation

- **OpenAI API:** ~$0.01-0.03 per summary
- **Hosting:** Free on Vercel
- **No database costs**

## Next Steps (Post-MVP)

- Add multiple URL support
- User accounts and saved summaries
- Different summary styles
- Export to PDF
- Subscription billing

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS
- **Backend:** Vercel Serverless Functions
- **APIs:** Wikipedia API + OpenAI API
- **Deployment:** Vercel

## License

MIT