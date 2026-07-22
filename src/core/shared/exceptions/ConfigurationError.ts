import { FrameworkError } from './FrameworkError';

export class ConfigurationError extends FrameworkError {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}
