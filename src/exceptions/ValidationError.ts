import { FrameworkError } from './FrameworkError';

export class ValidationError extends FrameworkError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
