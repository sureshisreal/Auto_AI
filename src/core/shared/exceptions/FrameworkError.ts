export class FrameworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FrameworkError';
    Object.setPrototypeOf(this, FrameworkError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
