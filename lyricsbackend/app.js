const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');

const app = express();
const server = createServer(app);

// app.use(express.json());
// app.use(express.urlencoded());

app.get('/status',async (req, res)=>{
    return res.status(200).json({status:"OK"})
});

app.get('/lyrics', async (req, res) => {
    const artist = req.query?.artist;
    const song = req.query?.song;

    if (!artist || !song) {
        return res.status(400).json({ error: 'Missing artist or song parameter' });
    }

    try {
        const apiResponse = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`);
        
        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({ error: "External API error." });
        }

        const data = await apiResponse.json();
    
        
        // Send the lyrics back to your frontend
        return res.json(data);

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Internal server error fetching lyrics' });
    }
});

server.listen(8001, () => {
  console.log('server running at http://localhost:8001');
});
