document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('projectForm').addEventListener('submit', function(event) {
        event.preventDefault();
        submitProject();
    });

    document.getElementById('profileForm').addEventListener('submit', function(event) {
        event.preventDefault();
        updateProfile();
    });

    const walletButtons = document.querySelectorAll('button[data-wallet]');
    walletButtons.forEach(button => {
        button.addEventListener('click', function() {
            connectWallet(this.getAttribute('data-wallet'));
        });
    });
}

function submitProject() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const skills = document.getElementById('skills').value.split(',').map(skill => skill.trim());

    console.log('Project submitted:', { title, description, skills });
    // Here, integrate AJAX request to backend
}

function updateProfile() {
    const profilePicture = document.getElementById('profilePicture').value;
    const bio = document.getElementById('bio').value;

    console.log('Profile updated:', { profilePicture, bio });
    // Here, integrate AJAX request to backend
}

function connectWallet(walletType) {
    console.log('Connecting to wallet:', walletType);
    // Here, integrate WalletConnect or Web3 modal
}

// Additional scripts for dynamic functionalities like handling task completions, rewards, and more can be added here
// Save profile data to the server
document.getElementById('profileForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const profile = {
        name: document.getElementById('name').value,
        skills: document.getElementById('skills').value,
        experience: document.getElementById('experience').value,
        portfolio: document.getElementById('portfolio').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/saveProfile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile)
        });

        const result = await response.json();
        if (result.success) {
            alert('Profile saved successfully!');
        }
    } catch (error) {
        console.error('Error saving profile:', error);
    }
});

// Fetch and display profile data on page load
async function loadProfileData() {
    try {
        const response = await fetch('http://localhost:3000/api/getProfile');
        const profile = await response.json();

        if (profile) {
            document.getElementById('name').value = profile.name;
            document.getElementById('skills').value = profile.skills;
            document.getElementById('experience').value = profile.experience;
            document.getElementById('portfolio').value = profile.portfolio;
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

window.onload = loadProfileData;

// Display opportunities dynamically
const projects = [
    { title: "Blockchain Developer", category: "development", description: "Looking for a blockchain and web3 developer to work on a new project." },
    { title: "UI/UX Designer", category: "design", description: "Need a designer to create a landing page and more for a project." },
    { title: "Crypto Marketer", category: "marketing", description: "Seeking a crypto marketer to help with outreach and social media." },
    { title: "KOL Partnership", category: "partnership", description: "Looking for a Key Opinion Leader to promote a project." },
    { title: "Content Creator", category: "content creation", description: "Need a professional content crestor to create and share contents for a project." },
    { title: "Discover New Projects", category: "discoverNewProject", description: "Complete new project tasks and qualify for rewards." },
];

function displayProjects(filteredCategory = 'all') {
    const projectList = document.getElementById('projectList');
    projectList.innerHTML = '';

    const filteredProjects = filteredCategory === 'all' ? projects : projects.filter(project => project.category === filteredCategory);

    filteredProjects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.classList.add('project-card');

        projectCard.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <button class="apply-btn">Explore Opportunity</button>
        `;

        projectList.appendChild(projectCard);
    });
}

document.getElementById('categoryFilter').addEventListener('change', (e) => {
    displayProjects(e.target.value);
});

// Initial display of all projects
displayProjects();

// Display discussions dynamically and allow posting new discussions
const discussions = [
    { user: "CZ", content: "Should we bring Giggle Academy to proSEED Hub?" },
    { user: "Altaaf", content: "Looking for feedback on my new crypto project!" },
    { user: "CZ", content: "If you can't hold, you won't be rich!" },
    { user: "Alice", content: "The best time to buy is when everyone believes that it's time to sell and the best time to sell is when everyone believes that it's best time to buy!" },
    { user: "Oyinbo Joseph", content: "Shill me top 10 projects to HODL until next Bitcoin halving." },
    { user: "J.T. Sun", content: "Have you started implementing what you have learned so far on this crypto space?" }
];

function displayDiscussions() {
    const discussionFeed = document.getElementById('discussionFeed');
    discussionFeed.innerHTML = '';

    discussions.forEach(discussion => {
        const post = document.createElement('div');
        post.classList.add('post');

        post.innerHTML = `
            <h4>${discussion.user}</h4>
            <p>${discussion.content}</p>
        `;

        discussionFeed.appendChild(post);
    });
}

document.getElementById('newPostForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const newPostContent = document.getElementById('newPost').value;
    discussions.push({ user: "You", content: newPostContent });
    displayDiscussions();
    document.getElementById('newPost').value = '';
});

// Initial display of discussions
displayDiscussions();

document.querySelectorAll('.container').forEach(item => {
    item.addEventListener('click', function() {
        // Toggle visibility of detailed descriptions
        this.querySelector('.content').classList.toggle('expanded');
    });
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, default: 'user' },
    dailyPoints: { type: Number, default: 1000 },
    lastCheckIn: { type: Date }
});

app.post('/api/dailyCheckIn', authorizeRoles('user', 'admin', 'moderator'), async (req, res) => {
    const user = await User.findOne({ username: req.user.username });

    const today = new Date().setHours(0, 0, 0, 0);
    const lastCheckIn = new Date(user.lastCheckIn).setHours(0, 0, 0, 0);

    if (today > lastCheckIn) {
        user.dailyPoints += 100; // Points for daily check-in
        user.lastCheckIn = new Date();
        await user.save();
        res.send({ success: true, message: 'Daily check-in successful', points: user.dailyPoints });
    } else {
        res.send({ success: false, message: 'Already checked in today' });
    }
});

app.post('/api/redeemPoints', authorizeRoles('user', 'admin', 'moderator'), async (req, res) => {
    const user = await User.findOne({ username: req.user.username });

    if (user.dailyPoints >= 100) { // Example threshold for redemption
        // Convert points to tokens and send to user’s wallet
        // Placeholder for actual token transfer logic

        user.dailyPoints -= 100; // Deduct points
        await user.save();

        res.send({ success: true, message: 'Points redeemed, tokens airdropped' });
    } else {
        res.send({ success: false, message: 'Not enough points to redeem' });
    }
});
document.getElementById('checkInBtn').addEventListener('click', async function() {
    try {
        const response = await fetch('http://localhost:3000/api/dailyCheckIn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });

        const result = await response.json();
        document.getElementById('checkInMessage').textContent = result.message;
        document.getElementById('pointsDisplay').textContent = `Points: ${result.points}`;
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('redeemBtn').addEventListener('click', async function() {
    try {
        const response = await fetch('http://localhost:3000/api/redeemPoints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });

        const result = await response.json();
        document.getElementById('checkInMessage').textContent = result.message;
        document.getElementById('pointsDisplay').textContent = `Points: ${result.points}`;
    } catch (error) {
        console.error('Error:', error);
    }
});

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/proseed', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', userSchema);

app.post('/api/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        username: req.body.username,
        password: hashedPassword
    });

    try {
        await user.save();
        res.send({ success: true });
    } catch {
        res.status(500).send({ error: 'Failed to register' });
    }
});

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({ username: user.username }, 'secret_key');
        res.send({ token });
    } else {
        res.status(400).send({ error: 'Invalid credentials' });
    }
});

app.post('/api/verifyToken', (req, res) => {
    try {
        const verified = jwt.verify(req.body.token, 'secret_key');
        res.send({ valid: true, username: verified.username });
    } catch {
        res.status(401).send({ valid: false });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));

document.getElementById('registerBtn').addEventListener('click', async function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        document.getElementById('authMessage').textContent = result.success ? 'Registration successful!' : 'Registration failed.';
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('loginBtn').addEventListener('click', async function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (result.token) {
            localStorage.setItem('authToken', result.token);
            document.getElementById('authMessage').textContent = 'Login successful!';
        } else {
            document.getElementById('authMessage').textContent = 'Login failed.';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function checkAuthentication() {
    const token = localStorage.getItem('authToken');
    if (token) {
        fetch('http://localhost:3000/api/verifyToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                console.log(`Welcome back, ${data.username}`);
            } else {
                localStorage.removeItem('authToken');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

window.onload = checkAuthentication;

const nodemailer = require('nodemailer');
const crypto = require('crypto');

const resetTokens = new Map(); // Temporary storage for reset tokens

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

app.post('/api/requestPasswordReset', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send({ error: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    resetTokens.set(token, user.username);

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    await transporter.sendMail({
        from: 'your-email@gmail.com',
        to: user.username,
        subject: 'Password Reset',
        text: `Reset your password using this link: ${resetLink}`
    });

    res.send({ success: true, message: 'Password reset email sent' });
});

app.post('/api/resetPassword', async (req, res) => {
    const { token, newPassword } = req.body;
    const username = resetTokens.get(token);

    if (!username) return res.status(400).send({ error: 'Invalid or expired token' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ username }, { password: hashedPassword });

    resetTokens.delete(token);
    res.send({ success: true, message: 'Password has been reset' });
});

document.getElementById('requestResetBtn').addEventListener('click', async function() {
    const email = document.getElementById('resetEmail').value;

    try {
        const response = await fetch('http://localhost:3000/api/requestPasswordReset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email })
        });

        const result = await response.json();
        document.getElementById('resetRequestMessage').textContent = result.success ? 'Check your email for reset link' : 'Failed to send reset email.';
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('resetPasswordBtn').addEventListener('click', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const newPassword = document.getElementById('newPassword').value;

    try {
        const response = await fetch('http://localhost:3000/api/resetPassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword })
        });

        const result = await response.json();
        document.getElementById('resetMessage').textContent = result.success ? 'Password reset successful!' : 'Password reset failed.';
    } catch (error) {
        console.error('Error:', error);
    }
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, default: 'user' } // Default role is 'user'
});

app.post('/api/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        username: req.body.username,
        password: hashedPassword,
        role: req.body.role || 'user' // Assign role during registration
    });

    try {
        await user.save();
        res.send({ success: true });
    } catch {
        res.status(500).send({ error: 'Failed to register' });
    }
});

function authorizeRoles(...roles) {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).send('Access Denied');

        try {
            const verified = jwt.verify(token, 'secret_key');
            req.user = verified;

            if (!roles.includes(req.user.role)) {
                return res.status(403).send('Forbidden');
            }
            next();
        } catch (error) {
            res.status(400).send('Invalid Token');
        }
    };
}

app.get('/api/admin', authorizeRoles('admin'), (req, res) => {
    res.send('Welcome, Admin');
});

app.get('/api/moderator', authorizeRoles('admin', 'moderator'), (req, res) => {
    res.send('Welcome, Moderator');
});

function renderUIBasedOnRole() {
    const token = localStorage.getItem('authToken');
    if (token) {
        fetch('http://localhost:3000/api/verifyToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                if (data.role === 'admin') {
                    document.getElementById('adminPanel').style.display = 'block';
                }
                if (data.role === 'moderator') {
                    document.getElementById('moderatorPanel').style.display = 'block';
                }
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

window.onload = renderUIBasedOnRole;

//create leaderboard endpoint
app.get('/api/leaderboard', async (req, res) => {
    try {
        const users = await User.find({}).sort({ dailyPoints: -1 }).limit(10).select('username dailyPoints');
        res.send(users);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve leaderboard' });
    }
});

//Fetch and Display Leaderboard Data
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('http://localhost:3000/api/leaderboard');
        const leaderboard = await response.json();

        const leaderboardList = document.getElementById('leaderboardList');
        leaderboardList.innerHTML = '';

        leaderboard.forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = `${user.username}: ${user.dailyPoints} points`;
            leaderboardList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error:', error);
    }
});

// add more tasks
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, default: 'user' },
    dailyPoints: { type: Number, default: 0 },
    lastCheckIn: { type: Date },
    dailyTasksCompleted: { type: Map, of: Boolean } // Track which tasks are completed
});

// daily quiz
app.post('/api/dailyQuiz', authorizeRoles('user', 'admin', 'moderator'), async (req, res) => {
    const user = await User.findOne({ username: req.user.username });

    if (!user.dailyTasksCompleted.get('quiz')) {
        user.dailyPoints += 20; // Points for completing the quiz
        user.dailyTasksCompleted.set('quiz', true);
        await user.save();
        res.send({ success: true, message: 'Quiz completed, points earned', points: user.dailyPoints });
    } else {
        res.send({ success: false, message: 'Quiz already completed today' });
    }
});

// content sharing
app.post('/api/shareContent', authorizeRoles('user', 'admin', 'moderator'), async (req, res) => {
    const user = await User.findOne({ username: req.user.username });

    if (!user.dailyTasksCompleted.get('shareContent')) {
        user.dailyPoints += 15; // Points for sharing content
        user.dailyTasksCompleted.set('shareContent', true);
        await user.save();
        res.send({ success: true, message: 'Content shared, points earned', points: user.dailyPoints });
    } else {
        res.send({ success: false, message: 'Content already shared today' });
    }
});

//referral
app.post('/api/referral', authorizeRoles('user', 'admin', 'moderator'), async (req, res) => {
    const { referredUser } = req.body;
    const user = await User.findOne({ username: req.user.username });
    const newUser = await User.findOne({ username: referredUser });

    if (newUser && !user.dailyTasksCompleted.get('referral')) {
        user.dailyPoints += 30; // Points for referring a new user
        user.dailyTasksCompleted.set('referral', true);
        await user.save();
        res.send({ success: true, message: 'Referral successful, points earned', points: user.dailyPoints });
    } else {
        res.send({ success: false, message: 'Referral failed or already completed' });
    }
});

// community participation
app.post('/api/communityParticipation', authorizeRoles('user', 'admin', 'moderator'), async (req, res) => {
    const user = await User.findOne({ username: req.user.username });

    if (!user.dailyTasksCompleted.get('participation')) {
        user.dailyPoints += 10; // Points for community participation
        user.dailyTasksCompleted.set('participation', true);
        await user.save();
        res.send({ success: true, message: 'Participation successful, points earned', points: user.dailyPoints });
    } else {
        res.send({ success: false, message: 'Already participated today' });
    }
});

// handling task completion
document.getElementById('quizBtn').addEventListener('click', async function() {
    await completeTask('/api/dailyQuiz', 'taskQuiz');
});

document.getElementById('shareBtn').addEventListener('click', async function() {
    await completeTask('/api/shareContent', 'taskShare');
});

document.getElementById('referralBtn').addEventListener('click', async function() {
    await completeTask('/api/referral', 'taskReferral', { referredUser: 'newUser' }); // Update referredUser dynamically
});

document.getElementById('participationBtn').addEventListener('click', async function() {
    await completeTask('/api/communityParticipation', 'taskParticipation');
});

async function completeTask(url, taskId, body = {}) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
            body: JSON.stringify(body)
        });

        const result = await response.json();
        document.getElementById('taskMessage').textContent = result.message;
        if (result.success) {
            document.getElementById(taskId).style.textDecoration = 'line-through';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// handling new reward
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, default: 'user' },
    dailyPoints: { type: Number, default: 0 },
    lastCheckIn: { type: Date },
    rewards: {
        tokens: { type: Number, default: 0 },
        nfts: [String], // Array of NFT identifiers
        badges: [String], // Array of badges earned
        premiumAccess: { type: Boolean, default: false },
        coupons: [String] // Array of coupon codes
    }
});

// redeem nft
app.post('/api/redeemNFT', authorizeRoles('user', 'admin', 'moderator'), async (req, res) => {
    const user = await User.findOne({ username: req.user.username });

    if (user.dailyPoints >= 500) { // Example threshold for NFT
        // Placeholder for actual NFT minting logic
        const newNFT = 'NFT-' + new Date().getTime(); // Example NFT ID

        user.rewards.nfts.push(newNFT);
        user.dailyPoints -= 500;
        await user.save();

        res.send({ success: true, message: 'NFT redeemed!', nft: newNFT });
    } else {
        res.send({ success: false, message: 'Not enough points for NFT' });
    }
});

// redeem premium access
app.post('/api/redeemPremium', authorizeRoles('user', 'admin', 'moderator'), async (req, res) => {
    const user = await User.findOne({ username: req.user.username });

    if (user.dailyPoints >= 1000) { // Example threshold for premium access
        user.rewards.premiumAccess = true;
        user.dailyPoints -= 1000;
        await user.save();

        res.send({ success: true, message: 'Premium access unlocked!' });
    } else {
        res.send({ success: false, message: 'Not enough points for premium access' });
    }
});

// redeem coupons
app.post('/api/redeemCoupon', authorizeRoles('user', 'admin', 'moderator'), async (req, res) => {
    const user = await User.findOne({ username: req.user.username });

    if (user.dailyPoints >= 200) { // Example threshold for coupons
        const newCoupon = 'COUPON-' + new Date().getTime(); // Example coupon code

        user.rewards.coupons.push(newCoupon);
        user.dailyPoints -= 200;
        await user.save();

        res.send({ success: true, message: 'Coupon redeemed!', coupon: newCoupon });
    } else {
        res.send({ success: false, message: 'Not enough points for a coupon' });
    }
});

// handle reward redemption
document.getElementById('redeemNFTBtn').addEventListener('click', async function() {
    await redeemReward('/api/redeemNFT');
});

document.getElementById('redeemPremiumBtn').addEventListener('click', async function() {
    await redeemReward('/api/redeemPremium');
});

document.getElementById('redeemCouponBtn').addEventListener('click', async function() {
    await redeemReward('/api/redeemCoupon');
});

async function redeemReward(url) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });

        const result = await response.json();
        document.getElementById('rewardsMessage').textContent = result.message;
    } catch (error) {
        console.error('Error:', error);
    }
}

//Create Notifications Endpoint
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, default: 'user' },
    dailyPoints: { type: Number, default: 0 },
    lastCheckIn: { type: Date },
    notifications: [{ message: String, read: { type: Boolean, default: false }, date: { type: Date, default: Date.now } }]
});

//Create Endpoint to Fetch Notifications
app.get('/api/notifications', authorizeRoles('user', 'admin', 'moderator'), async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username });
        res.send(user.notifications);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve notifications' });
    }
});

//Create Endpoint to Mark Notifications as Read
app.post('/api/notifications/read', authorizeRoles('user', 'admin', 'moderator'), async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username });
        user.notifications.forEach(notification => notification.read = true);
        await user.save();
        res.send({ success: true, message: 'Notifications marked as read' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to mark notifications as read' });
    }
});

//Function to Add Notifications
async function addNotification(username, message) {
    const user = await User.findOne({ username });
    user.notifications.push({ message });
    await user.save();
}

//Fetch and Display Notifications
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('http://localhost:3000/api/notifications', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        const notifications = await response.json();

        const notificationList = document.getElementById('notificationList');
        notificationList.innerHTML = '';

        notifications.forEach(notification => {
            const listItem = document.createElement('li');
            listItem.textContent = `${notification.message} - ${new Date(notification.date).toLocaleString()}`;
            if (!notification.read) listItem.classList.add('unread');
            notificationList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('markReadBtn').addEventListener('click', async function() {
    try {
        const response = await fetch('http://localhost:3000/api/notifications/read', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        const result = await response.json();
        if (result.success) {
            document.querySelectorAll('#notificationList li').forEach(li => li.classList.remove('unread'));
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

//When a user completes a task
await addNotification(user.username, 'You completed a task and earned 200 points!');

//When a reward is redeemed
await addNotification(user.username, 'You redeemed an NFT!');

//Log User Activity
const userSchema = new mongoose.Schema({
    username: String,
    activityLogs: [{ action: String, date: { type: Date, default: Date.now } }]
});

//Create Function to Log Activity
function logUserActivity(username, action) {
    User.findOne({ username }, (err, user) => {
        if (user) {
            user.activityLogs.push({ action });
            user.save();
        }
    });
}

//Incorporate the logging function wherever significant actions occur
app.post('/api/completeTask', authorizeRoles('user', 'admin', 'moderator'), async (req, res) => {
    // Assume task completion logic here
    logUserActivity(req.user.username, 'Completed a task');
    res.send({ success: true, message: 'Task completed!' });
});

//Fetch and Display Logs
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/userActivity', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    })
    .then(response => response.json())
    .then(data => {
        const logsList = document.getElementById('logsList');
        data.forEach(log => {
            const listItem = document.createElement('li');
            listItem.textContent = `${log.action} - ${new Date(log.date).toLocaleString()}`;
            logsList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error:', error));
});

//Create an endpoint to fetch the activity logs
app.get('/api/userActivity', authorizeRoles('user', 'admin', 'moderator'), async (req, res) => {
    const user = await User.findOne({ username: req.user.username });
    res.send(user.activityLogs);
});

