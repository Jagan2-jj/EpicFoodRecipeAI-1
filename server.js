const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const port = 3019;

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files

// Session configuration
app.use(session({
    secret: 'your-secret-key-here', // Change this to a random string in production
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// MongoDB connection
mongoose.connect('mongodb+srv://e-food:rYeUvzdsOtTV8o8m@food.chx76kj.mongodb.net/?retryWrites=true&w=majority&appName=food', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to database successfully"))
.catch(err => console.error("Database connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Registration route
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: "All fields are required" });
        }
        
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        
        await user.save();
        
        // Set session
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email
        };
        
        res.json({ 
            success: true,
            message: "Registration successful!",
            user: {
                name: user.name,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Registration failed. Please try again." });
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        
        // Set session
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email
        };
        
        res.json({ 
            success: true,
            message: "Login successful!",
            user: {
                name: user.name,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed. Please try again." });
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: "Could not log out" });
        }
        res.json({ success: true, message: "Logged out successfully" });
    });
});

// Protected route example
app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    res.json({ 
        message: `Welcome ${req.session.user.name}`,
        user: req.session.user
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
