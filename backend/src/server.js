import http from 'http';
import app from './app.js';
import { env } from './config/env.js';

import { connectDB } from './config/db.js';
import { initSocket } from './config/socket.js';

const server = http.createServer(app);
initSocket(server);

const PORT = env.PORT;

const startServer = async () => {
  await connectDB();
  
  server.listen(PORT, () => {
    console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();
