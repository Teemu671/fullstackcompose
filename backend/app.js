const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');

const app = express();
const server = createServer(app);

// app.use(express.json());
// app.use(express.urlencoded());

const { newPool } = require('./db.js')

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

app.get('/status',async (req, res)=>{
    return res.status(200).json({status:"OK"})
});



server.listen(8000, () => {
  console.log('server running at http://localhost:8000');
});
