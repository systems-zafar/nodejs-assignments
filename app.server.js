const http = require('http');
const fs = require('fs');
const cluster = require('cluster');
const debug = require('debug')('node-workshop:server');

const hostname = 'localhost';

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


const numCPUs = require('os').cpus().length;

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

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (Number.isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
    console.log(`Worker ${process.pid} listening on ${bind}`);
}
