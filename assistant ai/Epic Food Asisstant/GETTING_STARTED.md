# Getting Started with Epic Food Assistant

Welcome to Epic Food Assistant! This guide will help you set up and start using your new AI-powered recipe chatbot.

## Quick Start Guide

### Step 1: Get Your API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key (or use an existing one)
4. Copy the API key to your clipboard

### Step 2: Configure the Chatbot

1. Open the `app.js` file in a text editor
2. Find line 14 where it says: `const API_KEY = 'YOUR_GEMINI_API_KEY';`
3. Replace `'YOUR_GEMINI_API_KEY'` with your actual API key (keep the quotes)
4. Save the file

### Step 3: Test Your API Key (Optional)

1. Open `test-api.html` in your web browser
2. Paste your API key in the input field
3. Click "Test API" to verify your key works correctly
4. You should see a recipe response if everything is working

### Step 4: Launch the Chatbot

1. Open `index.html` in your web browser
2. You should see the chatbot interface with a welcome message
3. Start asking questions about recipes, ingredients, or cooking techniques!

## Example Queries to Try

Here are some example queries to get you started:

- "What can I make with chicken, rice, and bell peppers?"
- "I need a quick vegetarian dinner recipe"
- "How do I make homemade pizza dough?"
- "What's a healthy breakfast that takes less than 10 minutes?"
- "Give me some gluten-free dessert ideas"
- "What's the nutritional value of a typical serving of lasagna?"
- "I have leftover turkey, what can I make?"
- "What are some traditional Italian pasta dishes?"

## Troubleshooting

### API Key Issues

If you're having trouble with your API key:

1. Make sure you've copied the entire key correctly
2. Check that you've included the quotes around the key in the code
3. Verify your API key is active in the Google AI Studio dashboard
4. Try the test-api.html page to isolate API issues

### Browser Compatibility

- For best results, use Google Chrome
- Voice input only works in Chrome and some Chromium-based browsers
- If animations are slow, try reducing the number of background food items in the HTML

### Other Issues

- Clear your browser cache if you're experiencing strange behavior
- Check your browser console (F12) for any JavaScript errors
- Make sure all files (HTML, CSS, JS) are in the same directory

## Customization Ideas

Want to make the chatbot your own? Here are some ideas:

- Change the color scheme by editing the CSS variables at the top of styles.css
- Add more food items to the animated background
- Create custom suggestion chips for your specific food niche
- Modify the welcome message in the createWelcomeMessage() function
- Add your own logo or branding to the header

## Need More Help?

If you need additional assistance:

- Check the README.md file for more detailed information
- Visit the Google Gemini API documentation for API-specific questions
- Explore the code comments for insights into how different features work

Enjoy your new AI cooking assistant! 👨‍🍳