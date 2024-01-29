const express = require('express');
const bodyParser = require('body-parser');
const { DNS } = require('@google-cloud/dns');
const jwt = require('jsonwebtoken');

const app = express();
const port = 4000;

const dns = new DNS();
const JWT_SECRET = '123456'; // Change this to a secure random key in production

app.get('/' ,(req,res) =>{
    res.send("API is running");
});

app.use('/dns',(req,res) =>{
    res.send("asdfghjkl")
})

app.use(bodyParser.json());

// Middleware for authenticating requests
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Example route for creating a DNS record
app.post('/api/dns', authenticateToken, async (req, res) => {
  try {
    const { domain, type, value } = req.body;

    // Replace 'your-zone-name' with your actual GCP DNS zone name
    const zoneName = 'lucid-zone';
    const zone = dns.zone(zoneName);

    const record = {
      name: domain,
      type: type,
      ttl: 300,
      rrdatas: [value],
    };

    const [createdRecord] = await zone.createChange({
      add: record,
    }).execute();

    res.json({ success: true, record: createdRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Implement other CRUD operations similarly

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
