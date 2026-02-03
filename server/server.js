// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// API route to serve practice questions JSON securely
app.get('/api/practice-questions', (req, res) => {
  const secret = req.headers['x-secret-key'];
  if (secret !== process.env.API_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const filePath = path.join(__dirname, '..', 'mockquestions', 'practice_question.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  res.json(JSON.parse(jsonData));
});

// NEW: API route to serve mock test questions
app.get('/api/mock-test/:mockTestId', (req, res) => {
  const secret = req.headers['x-secret-key'];
  if (secret !== process.env.API_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { mockTestId } = req.params;
  
  // Validate mockTestId to prevent path traversal
  if (!mockTestId.match(/^[a-zA-Z0-9\-]+$/)) {
    return res.status(400).json({ error: 'Invalid mock test ID' });
  }

  const filePath = path.join(__dirname, '..', 'mockquestions', `${mockTestId}.json`);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Mock test not found' });
  }

  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(jsonData));
  } catch (error) {
    console.error('Error reading mock test file:', error);
    res.status(500).json({ error: 'Error loading mock test' });
  }
});

// NEW: API route to get list of available mock tests
app.get('/api/mock-tests', (req, res) => {
  const secret = req.headers['x-secret-key'];
  if (secret !== process.env.API_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const mockTestsDir = path.join(__dirname, '..', 'mockquestions');
  
  try {
    const files = fs.readdirSync(mockTestsDir);
    const mockTests = files
      .filter(file => file.startsWith('sat-mock-') && file.endsWith('.json'))
      .map(file => ({
        id: file.replace('.json', ''),
        name: file.replace('.json', '').split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        filename: file
      }));
    
    res.json(mockTests);
  } catch (error) {
    console.error('Error reading mock tests directory:', error);
    res.status(500).json({ error: 'Error loading mock tests list' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));