# News App

A modern news application built with React that provides personalized news content, AI-powered summaries, and multi-language support.

## Features

- **AWS Cognito Authentication**: Secure user authentication and account management
- **AI-Powered News Summaries**: Get concise, AI-generated summaries of top news stories
- **Multi-Language Support**: Read news in your preferred language with Google Translate integration
- **Location-Based News**: Get local news based on your current location
- **Customizable Categories**: Browse news by different categories (Business, Technology, Sports, etc.)
- **Responsive Design**: Beautiful and functional on all devices

## Screenshots

### Authentication
![Authentication Screen](src/screenshots/auth.png)

### News Feed
![News Feed](src/screenshots/feed.png)

### AI News Recap
![AI News Recap](src/screenshots/recap.png)

### Local News
![Local News](src/screenshots/local.png)

### Language Selection
![Language Selection](src/screenshots/language.png)

## Technology Stack

- React 19 with Vite
- AWS Amplify (Cognito) for authentication
- OpenAI API for AI-powered summaries
- GNews API for news content
- Google Translate API for language support
- ipapi.co for geolocation
- Axios for API requests
- CSS3 for styling

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your API keys:
   ```
   VITE_GNEWS_API_KEY=your_gnews_api_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_IPGEO_API_KEY=your_ipgeo_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Sign up for an account using email and password
2. Browse news by category using the navigation bar
3. Click on articles to read full content
4. Use the AI Recap feature for quick news summaries
5. Change language using the Google Translate widget
6. View local news based on your location
