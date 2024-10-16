import app from '../server';
import debugModule from 'debug';
import http from 'http';
import 'dotenv/config';
import { AddressInfo } from 'net';



const debug = debugModule('myapp:server');

const normalizePort = (val: string): number | string | false => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

const onError = (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}


const onListening = () => {
    const addr: AddressInfo | string | null = server.address();
    if (addr === null) {
        debug('Unable to determine server address.');
        return;
    } else {
        const bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }


}

const hostName = process.env.HOST_NAME || 'localhost';
const port = normalizePort(process.env.PORT || "8000");
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.log(`App listening on http://${hostName}:${port}/api/v1`);