// Epic Food Assistant - Powered by Gemini API
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-message');
    const clearButton = document.getElementById('clear-chat');
    const voiceButton = document.getElementById('voice-input');
    const loadingAnimation = document.getElementById('loading-animation');
    const suggestionChips = document.querySelectorAll('.chip');
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Gemini API Key - Replace with your actual API key
    const API_KEY = "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";
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    
    // Chat history for context
    let chatHistory = [];
    
    // Initialize with welcome messageS
    addBotMessage(createWelcomeMessage());
    animateBackgroundElements();
    
    // Event Listeners
    sendButton.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });
    
    clearButton.addEventListener('click', clearChat);
    voiceButton.addEventListener('click', startVoiceInput);
    
    // Add click events to suggestion chips
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            userInput.value = chip.textContent;
            handleUserMessage();
        });
    });
    
    // Add click events to feature cards
    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            let query = '';
            switch(card.id) {
                case 'recipe-finder':
                    query = 'I want to cook something with the ingredients I have: chicken, pasta, tomatoes, and garlic. What can I make?';
                    break;
                case 'cooking-guide':
                    query = 'Give me step-by-step instructions for making a classic margherita pizza.';
                    break;
                case 'nutrition-info':
                    query = 'What\'s the nutritional information for a typical serving of spaghetti bolognese?';
                    break;
                case 'dietary-filter':
                    query = 'Can you suggest some gluten-free and vegetarian dinner recipes?';
                    break;
            }
            userInput.value = query;
            handleUserMessage();
        });
    });
    
    // Handle user message submission
    function handleUserMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addUserMessage(message);
        userInput.value = '';
        
        // Show loading animation
        showLoading(true);
        
        // Add to chat history
        chatHistory.push({role: 'user', parts: [message]});
        
        // Get response from Gemini API
        getGeminiResponse(message)
            .then(response => {
                // Add bot response to chat
                addBotMessage(response);
                
                // Add to chat history
                chatHistory.push({role: 'model', parts: [response]});
                
                // Hide loading animation
                showLoading(false);
                
                // Scroll to bottom
                scrollToBottom();
            })
            .catch(error => {
                console.error('Error:', error);
                addBotMessage('Sorry, I encountered an error. Please try again later.');
                showLoading(false);
            });
    }
    
    // Function to get response from Gemini API
    async function getGeminiResponse(message) {
        try {
            // Create the system prompt for food assistant context
            const systemPrompt = `You are Chef Gemini, an AI-powered food and recipe assistant. 
            Your expertise includes:
            1. Recipe recommendations based on ingredients
            2. Step-by-step cooking instructions
            3. Nutritional information about recipes
            4. Dietary restriction filtering (vegetarian, vegan, gluten-free, etc.)
            
            Always be helpful, friendly, and enthusiastic about food. If you don't know something, admit it rather than making up information.
            Format your responses in a clean, readable way. Use emoji occasionally to add personality.`;
            
            // Prepare the request payload
            const payload = {
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: systemPrompt }]
                    }
                ]
            };
            
            // Add chat history for context (limit to last 10 messages)
            const recentHistory = chatHistory.slice(-10);
            recentHistory.forEach(msg => {
                payload.contents.push({
                    role: msg.role,
                    parts: [{ text: msg.parts[0] }]
                });
            });
            
            // Add the current message
            payload.contents.push({
                role: 'user',
                parts: [{ text: message }]
            });
            
            // Make the API request
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            
            // Extract the response text
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Invalid response format from API');
            }
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            return 'I apologize, but I\'m having trouble connecting to my cooking brain right now. Please try again later.';
        }
    }
    
    // Function to add user message to chat
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user-message');
        
        const messageText = document.createElement('div');
        messageText.classList.add('message-text');
        messageText.textContent = message;
        
        const messageTime = document.createElement('div');
        messageTime.classList.add('message-time');
        messageTime.textContent = getCurrentTime();
        
        messageElement.appendChild(messageText);
        messageElement.appendChild(messageTime);
        
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    // Function to add bot message to chat
    function addBotMessage(message) {
        // First add typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'assistant-message', 'typing-indicator');
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.classList.add('typing-dot');
            typingIndicator.appendChild(dot);
        }
        
        chatMessages.appendChild(typingIndicator);
        scrollToBottom();
        
        // Simulate typing delay
        setTimeout(() => {
            // Remove typing indicator
            chatMessages.removeChild(typingIndicator);
            
            // Create actual message
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'assistant-message');
            
            const messageText = document.createElement('div');
            messageText.classList.add('message-text');
            
            // Process message for special formatting
            messageText.innerHTML = processMessageFormatting(message);
            
            const messageTime = document.createElement('div');
            messageTime.classList.add('message-time');
            messageTime.textContent = getCurrentTime();
            
            messageElement.appendChild(messageText);
            messageElement.appendChild(messageTime);
            
            chatMessages.appendChild(messageElement);
            scrollToBottom();
            
            // Add animation to the message
            messageElement.style.opacity = '0';
            messageElement.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                messageElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                messageElement.style.opacity = '1';
                messageElement.style.transform = 'translateY(0)';
            }, 50);
        }, 1500); // Simulate typing delay
    }
    
    // Process message formatting (convert markdown-like syntax to HTML)
    function processMessageFormatting(message) {
        // Check if the message contains a recipe card pattern
        if (message.includes('## Recipe:') || message.includes('# Recipe')) {
            return createRecipeCard(message);
        }
        
        // Basic markdown-like formatting
        let formattedMessage = message
            // Bold text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic text
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Headers
            .replace(/## (.*?)(?:\n|$)/g, '<h3>$1</h3>')
            .replace(/# (.*?)(?:\n|$)/g, '<h2>$1</h2>')
            // Lists
            .replace(/^\d+\.\s+(.*?)(?:\n|$)/gm, '<li>$1</li>')
            .replace(/^-\s+(.*?)(?:\n|$)/gm, '<li>$1</li>')
            // Line breaks
            .replace(/\n/g, '<br>');
        
        // Wrap lists in <ul> or <ol>
        if (formattedMessage.includes('<li>')) {
            formattedMessage = formattedMessage.replace(/<li>(.*?)<\/li>/g, function(match) {
                return '<ul>' + match + '</ul>';
            });
            // Remove nested <ul>
            formattedMessage = formattedMessage.replace(/<\/ul><ul>/g, '');
        }
        
        return formattedMessage;
    }
    
    // Create a recipe card from message
    function createRecipeCard(message) {
        // Extract recipe details
        const titleMatch = message.match(/# (.*?)(?:\n|$)/) || message.match(/## Recipe: (.*?)(?:\n|$)/);
        const title = titleMatch ? titleMatch[1] : 'Delicious Recipe';
        
        // Generate a random food image URL (in a real app, you'd use actual recipe images)
        const imageUrl = `https://source.unsplash.com/random/300x200/?food,${title.replace(/\s+/g, ',')}`;
        
        // Extract cooking time if available
        const timeMatch = message.match(/Time: (.*?)(?:\n|$)/) || message.match(/Cooking time: (.*?)(?:\n|$)/);
        const cookingTime = timeMatch ? timeMatch[1] : '30 mins';
        
        // Extract difficulty if available
        const difficultyMatch = message.match(/Difficulty: (.*?)(?:\n|$)/);
        const difficulty = difficultyMatch ? difficultyMatch[1] : 'Medium';
        
        // Extract ingredients
        let ingredients = '';
        if (message.includes('Ingredients:')) {
            const ingredientsSection = message.split('Ingredients:')[1].split(/Instructions:|Directions:|Method:|Steps:/)[0];
            ingredients = ingredientsSection
                .split('\n')
                .filter(line => line.trim().startsWith('-') || line.trim().match(/^\d+\./))
                .map(line => line.trim().replace(/^-\s+/, '').replace(/^\d+\.\s+/, ''))
                .join(', ');
        }
        
        // Extract tags
        const tags = [];
        if (message.toLowerCase().includes('vegetarian')) tags.push('Vegetarian');
        if (message.toLowerCase().includes('vegan')) tags.push('Vegan');
        if (message.toLowerCase().includes('gluten-free')) tags.push('Gluten-Free');
        if (message.toLowerCase().includes('dairy-free')) tags.push('Dairy-Free');
        if (message.toLowerCase().includes('low-carb')) tags.push('Low-Carb');
        if (tags.length === 0) tags.push('Recipe');
        
        // Create recipe card HTML
        const recipeCard = `
            <div class="recipe-card">
                <div class="recipe-image">
                    <img src="${imageUrl}" alt="${title}">
                </div>
                <div class="recipe-content">
                    <h3 class="recipe-title">${title}</h3>
                    <div class="recipe-info">
                        <span><i class="fas fa-clock"></i> ${cookingTime}</span>
                        <span><i class="fas fa-signal"></i> ${difficulty}</span>
                    </div>
                    <p>${ingredients.length > 100 ? ingredients.substring(0, 100) + '...' : ingredients}</p>
                    <div class="recipe-tags">
                        ${tags.map(tag => `<span class="recipe-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div>${message.replace(/# (.*?)(?:\n|$)/, '').replace(/## Recipe: (.*?)(?:\n|$)/, '')}</div>
        `;
        
        return recipeCard;
    }
    
    // Create welcome message
    function createWelcomeMessage() {
        return `👨‍🍳 **Welcome to Epic Food Assistant!** 

I\'m Chef Gemini, your AI cooking companion. I can help you with:

- 🍲 Recipe recommendations based on ingredients you have
- 📝 Step-by-step cooking instructions
- 🥗 Nutritional information about recipes
- 🌱 Dietary restriction filtering (vegetarian, vegan, gluten-free, etc.)

Try asking me something like:
"What can I make with chicken and broccoli?"
"How do I make chocolate chip cookies from scratch?"
"What are some healthy vegetarian dinner ideas?"

What would you like to cook today?`;
    }
    
    // Get current time in HH:MM format
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Scroll chat to bottom
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Clear chat history
    function clearChat() {
        // Add animation before clearing
        const messages = chatMessages.querySelectorAll('.message');
        let delay = 0;
        
        messages.forEach(message => {
            setTimeout(() => {
                message.style.transition = 'all 0.3s ease';
                message.style.opacity = '0';
                message.style.transform = 'translateX(20px)';
            }, delay);
            delay += 50;
        });
        
        // Clear after animations
        setTimeout(() => {
            chatMessages.innerHTML = '';
            chatHistory = [];
            addBotMessage(createWelcomeMessage());
        }, delay + 300);
    }
    
    // Voice input functionality
    function startVoiceInput() {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice input is not supported in your browser. Try using Chrome.');
            return;
        }
        
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        // Change button appearance
        voiceButton.classList.add('recording');
        voiceButton.innerHTML = '<i class="fas fa-microphone-alt"></i>';
        
        recognition.onstart = function() {
            userInput.placeholder = 'Listening...';
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
            voiceButton.classList.remove('recording');
            voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
            userInput.placeholder = 'Ask about any recipe, ingredient, or cooking technique...';
        };
        
        recognition.onend = function() {
            voiceButton.classList.remove('recording');
            voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
            userInput.placeholder = 'Ask about any recipe, ingredient, or cooking technique...';
            
            // If we got a result, send the message
            if (userInput.value.trim() !== '') {
                setTimeout(() => handleUserMessage(), 500);
            }
        };
        
        recognition.start();
    }
    
    // Show/hide loading animation
    function showLoading(show) {
        if (show) {
            loadingAnimation.classList.add('active');
        } else {
            loadingAnimation.classList.remove('active');
        }
    }
    
    // Animate background food elements
    function animateBackgroundElements() {
        const foodItems = document.querySelectorAll('.food-item');
        
        foodItems.forEach(item => {
            // Set random starting positions
            const randomX = Math.random() * window.innerWidth;
            const randomY = Math.random() * window.innerHeight;
            
            item.style.left = `${randomX}px`;
            item.style.top = `${randomY}px`;
        });
    }
    
    // Add resize listener to adjust animations
    window.addEventListener('resize', animateBackgroundElements);
    
    // Add some interactivity to the UI elements
    document.querySelectorAll('.feature-card, .chip, button').forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.05)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
        });
    });
});