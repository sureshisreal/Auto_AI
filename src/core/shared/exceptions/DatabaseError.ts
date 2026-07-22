import { FrameworkError } from './FrameworkError';

export class DatabaseError extends FrameworkError {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
