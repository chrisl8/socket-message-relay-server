import express from 'express';
import { Server } from 'socket.io';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const port = process.env.PORT || 3005;
// Fancy Express Web Server
// All of my "static" web pages are in the public folder
const app = express();
const webServer = app.listen(port);
const io = new Server(webServer);

// https://stackoverflow.com/a/64383997/4982408
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.disable('x-powered-by'); // Do not volunteer system info!

app.use(express.static(`${__dirname}/public`));

app.use(express.json()); // to support JSON-encoded bodies
app.use(
  express.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  }),
);

app.disable('x-powered-by'); // Do not volunteer system info!

app.use(express.static(`${__dirname}/public`));

app.use(express.json()); // to support JSON-encoded bodies
app.use(
  express.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  }),
);

io.on('connection', (socket) => {
  const remoteIp =
    socket.handshake.headers['x-real-ip'] || socket.conn.remoteAddress;
  console.log(`Console has CONNECTED from ${remoteIp} socket ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(
      `Console has DISconnected from ${remoteIp} socket ${socket.id}`,
    );
  });
  socket.on('messageData', (data) => {
    console.log(`Received messageData: ${data}`);
    socket.broadcast.emit('messageData', data);
    socket.send('messageData', 'Roger Roger');
  });
});

app.use(express.static(`${__dirname}/public`));

async function closeServer() {
  console.log('Server shutdown requested. PLEASE BE PATIENT! Working on it...');
  console.log('Server: Closing Database...');
  process.exit();
}

process.on('SIGINT', async () => {
  await closeServer();
});
