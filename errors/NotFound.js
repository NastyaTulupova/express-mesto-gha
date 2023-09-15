class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Not found';
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
