require('module-alias/register');
require('dotenv').config();

const app = require('./app');

const http = require('http');
const socketIO = require('socket.io');

const { PORT } = require('./config/config');
const { cacheService } = require('./services');
const cronRun = require('./cron-jobs');
const { socketRouter } = require('./routes');

const server = http.createServer(app);

const io = socketIO(server, { cors: { origin: '*' } });

global.io = io;

io.on('connection', (socket) => socketRouter(io, socket));

server.listen(PORT, async () => {
  console.log(`App listen ${PORT}`);

  await cacheService.client.connect();

  cronRun();
});
