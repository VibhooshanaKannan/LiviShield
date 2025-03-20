// logger.js
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const pinoPretty = require('pino-pretty');

// Create a write stream to a file
const logFile = path.join(__dirname, 'combined.log');
const fileStream = fs.createWriteStream(logFile, { flags: 'a' }); // 'a' for append mode

// Create a pino logger with pretty print for console and file stream
const logger = pino(
  {
    level: 'info',
    // The pretty print is handled by pino-pretty
  },
  pino.multistream([
    { stream: pinoPretty() }, // Pretty print for console
    { stream: fileStream } // File logging
  ])
);

module.exports = logger;
