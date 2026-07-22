import { FrameworkError } from './FrameworkError';

export class ElementError extends FrameworkError {
  constructor(message: string) {
    super(message);
    this.name = 'ElementError';
    Object.setPrototypeOf(this, ElementError.prototype);
  }
}
