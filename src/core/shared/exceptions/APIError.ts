import { FrameworkError } from './FrameworkError';

export class APIError extends FrameworkError {
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
    Object.setPrototypeOf(this, APIError.prototype);
  }
}
