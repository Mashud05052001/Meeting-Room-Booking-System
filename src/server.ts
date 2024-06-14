import mongoose from 'mongoose';
import { Server } from 'http';
import app from './app';
import config from './app/config';
const PORT = config.port || 5000;
let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(PORT, () => {
      console.log(`The server is running on ${PORT} port.`);
    });
  } catch (error) {
    console.log('Error found in mongoose connection time');
  }
}

main();

process.on('unhandledRejection', () => {
  console.log('💀 Unhelded Rejection is detected, Shutting down...');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

process.on('uncaughtException', () => {
  console.log('💀 Uncaught Exception is detected, Shutting down...');
  process.exit(1);
});
