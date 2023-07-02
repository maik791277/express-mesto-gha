const path = require('path');
const fs = require('fs');
const pino = require('pino');
const prettifier = require('pino-pretty');

const logFilePath = path.join(__dirname, 'logs.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
const logger = pino({
  level: 'error',
  prettifier,
}, logStream);

module.exports = logger;
