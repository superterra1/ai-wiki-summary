# 🤖 AI Wikipedia Summarizer

Transform lengthy Wikipedia articles into concise, intelligent summaries using advanced AI technology. This modern web application provides an intuitive interface for getting key insights from Wikipedia articles in seconds.

## ✨ Features

### Core Functionality
- **AI-Powered Summarization**: Uses advanced language models to generate intelligent summaries
- **Multiple Length Options**: Choose from Short (50-100 words), Medium (100-200 words), or Long (200-300 words)
- **Real-time URL Validation**: Instant feedback on Wikipedia URL validity
- **Progress Tracking**: Visual progress indicators showing summarization steps

### User Experience
- **Modern UI Design**: Clean, professional interface with smooth animations
- **Mobile Responsive**: Optimized for all device sizes
- **Dark/Light Theme**: Automatic theme adaptation based on system preferences
- **Accessibility Features**: ARIA labels, keyboard navigation, and screen reader support

### Smart Features
- **Summary History**: Local storage of recent summaries for quick access
- **Copy & Share**: Easy sharing and copying of summaries
- **Fallback Support**: Wikipedia extract fallback when AI models are unavailable
- **Error Handling**: Comprehensive error messages with helpful suggestions

### Technical Features
- **Multiple AI Models**: Tries various models for optimal results
- **Smart Caching**: Efficient content processing and caching
- **Progressive Loading**: Multi-step loading with visual feedback
- **Cross-platform**: Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- A Hugging Face API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-wiki-summary
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   PORT=3000
   ```

   Get your free Hugging Face API key from: https://huggingface.co/settings/tokens

4. **Start the application**
   ```bash
   pnpm start
   # or
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 How to Use

1. **Enter a Wikipedia URL**: Paste any Wikipedia article URL into the input field
2. **Choose Summary Length**: Select from Short, Medium, or Long summary options
3. **Generate Summary**: Click the "Generate Summary" button
4. **View Results**: Read your AI-generated summary with word count and reading time
5. **Save or Share**: Save to history, copy to clipboard, or share the summary

### Example URLs
- https://en.wikipedia.org/wiki/Artificial_intelligence
- https://en.wikipedia.org/wiki/Machine_learning
- https://en.wikipedia.org/wiki/Climate_change
- https://en.wikipedia.org/wiki/Space_exploration

## 🛠️ Technical Architecture

### Backend
- **Express.js**: Fast, minimal web framework
- **Hugging Face API**: Multiple AI models for summarization
- **Wikipedia API**: Content fetching and validation

### Frontend
- **Vanilla JavaScript**: No framework dependencies for optimal performance
- **CSS Grid & Flexbox**: Modern layout techniques
- **Local Storage**: Client-side history management
- **Progressive Enhancement**: Works without JavaScript for basic functionality

### AI Models Used
1. **facebook/bart-large-cnn**: Optimized for news and article summarization
2. **microsoft/DialoGPT-medium**: Conversational AI model
3. **google/pegasus-xsum**: Abstractive summarization specialist
4. **t5-base**: General-purpose text-to-text transformer

## 🎨 Design System

The application uses a comprehensive design system with:
- **Color Palette**: Carefully selected colors for accessibility and aesthetics
- **Typography**: Inter font family for optimal readability
- **Spacing System**: Consistent spacing using CSS custom properties
- **Component Library**: Reusable UI components with consistent styling
- **Animation System**: Smooth transitions and micro-interactions

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first approach**: Optimized for mobile devices
- **Breakpoint system**: Adaptive layouts for different screen sizes
- **Touch-friendly**: Large tap targets and swipe gestures
- **Performance optimized**: Minimal bundle size and fast loading

## 🔧 Configuration

### Environment Variables
- `HUGGINGFACE_API_KEY`: Your Hugging Face API key (required)
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

### Customization
The application can be customized by modifying:
- **CSS Variables**: Update the design system in `:root`
- **AI Models**: Add or modify models in `api/summarize.js`
- **Summary Parameters**: Adjust length parameters in the API
- **UI Components**: Modify HTML structure and styling

## 🚀 Deployment

### Local Development
```bash
pnpm dev
# or
npm run dev
```

### Production Build
The application is ready for deployment to:
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting with serverless functions
- **Heroku**: Container-based deployment
- **Docker**: Containerized deployment

### Example Deployment (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `HUGGINGFACE_API_KEY` environment variable
4. Deploy with zero configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Hugging Face**: For providing excellent AI models and API
- **Wikipedia**: For the comprehensive encyclopedia and API
- **Open Source Community**: For the tools and libraries that make this possible

## 📞 Support

If you encounter any issues or have questions:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

---

Made with ❤️ by [Your Name] | Powered by AI