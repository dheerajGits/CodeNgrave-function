import express from 'express';
import multiparty from 'connect-multiparty';
import { generateGCode } from './generateGCode';

const app = express();
const multipartMiddleware = multiparty();

app.post('/upload', multipartMiddleware, async (req, res) => {
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

export default app;
