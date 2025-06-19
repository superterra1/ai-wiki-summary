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

- ✅ **Clean, Modern Interface:** A user-friendly and aesthetically pleasing design.
- ✅ **Fast Wikipedia Content Fetching:** Efficiently retrieves article content using the Wikipedia API.
- ✅ **AI-Powered Summarization:** Leverages advanced AI (OpenAI) to generate intelligent and concise summaries.
- ✅ **Copy to Clipboard:** Easily copy the generated summary with a single click.
- ✅ **Error Handling:** Robust error management for invalid URLs or API issues.
- ✅ **Mobile Responsive:** Adapts seamlessly to various screen sizes for an optimal experience on any device.

## Cost Estimation

- **OpenAI API:** Approximately $0.01-0.03 per summary, depending on the article length and model used.
- **Hosting:** Free tier on Vercel, making it cost-effective for personal projects or low-traffic applications.
- **No Database Costs:** The application does not require a database, simplifying deployment and reducing infrastructure expenses.

## Future Enhancements (Post-MVP)

- **Multiple URL Support:** Allow users to summarize multiple Wikipedia articles simultaneously.
- **User Accounts and Saved Summaries:** Implement user authentication to enable saving and managing past summaries.
- **Different Summary Styles:** Offer options for various summary lengths (e.g., brief, detailed) or perspectives.
- **Export to PDF:** Provide functionality to export summaries as PDF documents.
- **Subscription Billing:** Introduce a subscription model for advanced features or higher usage limits.

## Technologies Used

- **Frontend:** Vanilla HTML, CSS, and JavaScript for a lightweight and flexible user interface.
- **Backend:** Vercel Serverless Functions, providing a scalable and efficient environment for API handling.
- **APIs:** Wikipedia API for content retrieval and OpenAI API for intelligent text summarization.
- **Deployment:** Vercel, for seamless continuous integration and deployment.

## License

MIT