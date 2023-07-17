const { BaseError } = require('./BaseError');

class ClientError extends BaseError {
  constructor(message, status = 400) {
    super(message, status);
  }
}

module.exports = {
  ClientError,
};
