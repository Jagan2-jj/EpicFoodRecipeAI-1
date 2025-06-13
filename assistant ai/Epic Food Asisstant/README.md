# Epic Food Assistant

A beautiful, animated AI chatbot for food recipes powered by Google's Gemini API.

## Features

- **Recipe Recommendations**: Get recipe ideas based on ingredients you have
- **Cooking Instructions**: Step-by-step guidance for preparing dishes
- **Nutritional Information**: Learn about the nutritional content of recipes
- **Dietary Restrictions**: Filter recipes based on dietary needs (vegetarian, vegan, gluten-free, etc.)

## UI Features

- Animated food-themed background elements
- Interactive chat interface with typing indicators
- Recipe cards with visual presentation
- Voice input capability
- Suggestion chips for quick queries
- Feature cards for common recipe needs
- Loading animation with cooking theme
- Responsive design for all devices

## Setup Instructions

1. **Get a Gemini API Key**:

   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key if you don't have one

2. **Add Your API Key**:

   - Open `app.js`
   - Replace `YOUR_GEMINI_API_KEY` with your actual API key:
     ```javascript
     const API_KEY = "YOUR_GEMINI_API_KEY";
     ```

3. **Run the Application**:
   - Open `index.html` in a web browser
   - No server setup required for basic functionality

## Usage

- Type your food-related questions in the chat input
- Click the microphone icon to use voice input (Chrome browser recommended)
- Try the suggestion chips for quick recipe ideas
- Click on feature cards to explore different capabilities
- Clear the chat history with the broom icon

## Browser Compatibility

- Chrome (recommended for full feature support including voice input)
- Firefox
- Safari
- Edge

## Dependencies

- Font Awesome (for icons)
- Google Fonts (Poppins)
- Lottie Web (for animations)

## Notes

- The chatbot uses the Gemini Pro model for generating responses
- Voice input requires Chrome browser and microphone access
- Recipe images are randomly generated placeholders from Unsplash

## Customization

You can customize the chatbot by:

- Changing the color scheme in the CSS variables
- Adding more suggestion chips in the HTML
- Modifying the system prompt in the JavaScript file
- Adding additional animations or UI elements

## License

This project is open source and available for personal and commercial use.

---

Enjoy your AI-powered cooking companion! 👨‍🍳
