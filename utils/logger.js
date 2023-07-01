const pino = require('pino');
const prettifier = require('pino-pretty');
const fs = require('fs');

const logger = pino({
  level: 'info',
  prettifier,
}, fs.createWriteStream('logs.log', { flags: 'a' }));

module.exports = logger;
