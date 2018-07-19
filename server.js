const path = require('path');
const http = require('http');
const express = require('express');

const favicon = require('serve-favicon');


const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.use(favicon(path.join(__dirname, 'src/index.ico')));


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || '8000';

http.createServer(app).listen(port, () => console.log("Сервер запущен на localhost:%s", port));
