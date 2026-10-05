const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');

const app = express();
const server = createServer(app);

const LYRICS_URI = process.env.LYRICS_URI || "http://localhost:8001";
// app.use(express.json());
// app.use(express.urlencoded());

const { newPool } = require('./db.js')

//old status
app.get('/status',async (req, res)=>{
    return res.status(200).json({status:"OK"})
});


//database api

app.get('/time',async (req, res)=>{
    const sql = `SELECT NOW() as time`
    //await newPool.promise().execute('UPDATE test SET count=count+1;')
    const [rows,fields] = await newPool.promise().query(sql)
    const result = rows.length==1 ? rows[0] : rows;
    return res.status(200).json(result)
});

app.get('/visits',async (req, res)=>{
    const sql = `SELECT count FROM test`
    const [rows,fields] = await newPool.promise().query(sql)
    const result = rows.length==1 ? rows[0] : rows;
    return res.status(200).json(result)
});

app.post('/visit',async (req, res)=>{
    const sql = `SELECT count FROM test`
    await newPool.promise().execute('UPDATE test SET count=count+1;')
    const [rows,fields] = await newPool.promise().query(sql)
    const result = rows.length==1 ? rows[0] : rows;
    return res.status(200).json(result)
});



//public api week 5
app.get('/lyrics', async (req, res) => {
    const artist = req.query?.artist;
    const song = req.query?.song;

    if (!artist || !song) {
        return res.status(400).json({ error: 'Missing artist or song parameter' });
    }

    try {
        const apiResponse = await fetch(`${LYRICS_URI}/lyrics/?artist=${encodeURIComponent(artist)}&song=${encodeURIComponent(song)}`);

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({ error: "External API error." });
        }

        const data = await apiResponse.json();

        if (data.error) {
            return res.status(404).json({ error: data.error });
        }

        return res.json({ lyrics: data.lyrics || 'No lyrics text returned' });

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Internal server error fetching lyrics' });
    }
});


//status, health, ready
app.get('/healthz', (req, res) => {
    console.log(JSON.stringify({
                timestamp: new Date().toISOString(),
                method: req.method,
                path: req.path,
                statusCode: res.statusCode
            }))
    return res.status(200).send('ok');
});

app.get('/readyz', async (req, res) => {
    try {
        const sql = `SELECT 1 AS ping`
        const [rows,fields] = await newPool.promise().query(sql)
        console.log(JSON.stringify({
                timestamp: new Date().toISOString(),
                probeType: req.path,
                path: req.path,
                statusCode: res.statusCode
            }))
        return res.status(200).send('ready')
    } catch (err) {
        console.error(JSON.stringify({
            timestamp: new Date().toISOString(),
            level: 'ERROR',
            message: 'Database connection failed',
            error: err.message
        }));
        return res.status(503).send('database disconnected');
    }
});

server.listen(8000, () => {
    console.log('server running at http://localhost:8000');
});
