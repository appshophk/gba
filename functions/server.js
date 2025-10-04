const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const app = express();
const router = express.Router();

app.use(express.static(path.join(__dirname, '../public'))); // serves static files

router.get('/hello', (req, res) => res.json({ message: 'Hello' }));
app.use('/.netlify/functions/server', router);

module.exports.handler = serverless(app);
