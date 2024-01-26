const express = require('express');
const redis = require('redis');
const cookieParser = require('cookie-parser');

const { promisify } = require('util');

const app = express();
const port = 3000;

const client = redis.createClient({legacyMode: true});

client.on('error', (err) => {
  console.log(`Redis Error: ${err}`);
});

const setAsync = promisify(client.set).bind(client);

app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(cookieParser());

function deduplicateRequests(req, res, next) {
    // Adjust this based on your session management
    const sessionId = req.cookies && req.cookies.sessionId ? req.cookies.sessionId : null;
    const url = req.originalUrl;
    const queryParams = req.query ? JSON.stringify(req.query) : null;
    const requestBody = req.method === 'GET' ? null : JSON.stringify(req.body);
  
    if (!sessionId || !url || !queryParams) {
      return res.status(400).json({ error: 'Invalid Request Format' });
    }
  
    const uniqueIdentifier = `${sessionId}:${url}:${queryParams}:${requestBody || ''}`;
  
    client.get(uniqueIdentifier, (err, reply) => {
      if (err) {
        console.error(`Redis Error: ${err}`);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (reply) {
        return res.status(400).json({ error: 'Duplicate Request' });
      }
  
      setAsync(uniqueIdentifier, '1', 'EX', 2) // Set with expiration time (60 seconds)
        .then(() => next())
        .catch((err) => {
          console.error(`Redis Error: ${err}`);
          return res.status(500).json({ error: 'Internal Server Error' });
        });
    });
  }
  
  app.use(deduplicateRequests);
  

app.post('/process-request', (req, res) => {
  // Your request processing logic goes here
  res.json({ success: true });
});

app.listen(port, async () => {
    await client.connect()
  console.log(`Server is running on port ${port}`);
});


process.on('SIGINT', () => {
    client.quit();
    process.exit();
  });