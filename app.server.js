const http = require('http');
const fs = require('fs');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/html'});
    const url = request.url;
    if(url ==='/') {
        const welcomeContent = "Welcome to NodeJS Training Workshop Assignment 1.<br/>Please click <a href='/readfile' target='_blank'>here</a> to read file";
        response.write(welcomeContent);
        response.end();
    }
    else if(url ==='/readfile') {
        fs.readFile('fileread.txt', function(err, data) {
            response.write(data);
            return response.end();
        });
    }
    else {
        const invalidContent = "Invalid path.<br/>Click <a href='/'>here</a> for home page";
        response.write(invalidContent);
        response.end();
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
