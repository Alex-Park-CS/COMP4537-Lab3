const http = require('http');
const url = require('url');
const fs = require('fs');
const dateTime = require('./modules/utils.js').dateTime;
const messages = require('./lang/messages/en/en.js');

class Server {
    constructor(port) {
        this.port = port;
    }

    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const query = parsedUrl.query;
        const name = query.name || 'Guest';

        console.log("Pathname:", pathname);
        console.log("Query:", query.text);


        if (pathname === '/COMP4537/labs/3/readFile/file.txt') {
            this.readFile(res);
        } else if (pathname === '/COMP4537/labs/3/writeFile/') {
            this.writeFile(res, query.text || '');
        } else {
            this.sendGreeting(res, name);
        }
    }

    readFile(res) {
        fs.readFile('file.txt', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`Error 404: File not found`);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }

    writeFile(res, text) {
        fs.appendFile('file.txt', text + '\n', (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end("Error saving file!");
                throw err;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end("File has been saved!");
        });
    }

    sendGreeting(res, name) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`<p style="color: blue;">${messages.greeting.replace('%1', name)} ${dateTime()}</p>`);
        res.end();
    }

    start() {
        http.createServer((req, res) => this.handleRequest(req, res)).listen(this.port);
        console.log(`Server is running and listening on port ${this.port}...`);
    }
}

// Instantiate and start the server
const server = new Server(8000);
server.start();