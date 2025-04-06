const express = require('express');
const multiparty = require('connect-multiparty');
const { generateGCode } = require('./generateGCode');
const path = require('path');


const app = express();
const multipartMiddleware = multiparty();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/', multipartMiddleware, async (req, res) => {
    try {
        const file = req.files?.image;
        const path = file?.path;
        if (!path) return res.status(400).send('No image uploaded');
    
        const gcode = await generateGCode(path);
        res.type('text/plain').send(gcode);
      } catch (error) {
        console.error('Error generating G-code:', error);
        res.status(500).send('Internal Server Error');
      }
    
});

module.exports = app;
