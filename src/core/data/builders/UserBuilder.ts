import { faker } from '@faker-js/faker';
import { User } from '../../data/models/User.model';
import { UserRole } from '../../data/enums/UserRole';

export class UserBuilder {
  private user: User = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: UserRole.STANDARD,
  };

  public withFirstName(firstName: string): UserBuilder {
    this.user.firstName = firstName;
    return this;
  }

  public withLastName(lastName: string): UserBuilder {
    this.user.lastName = lastName;
    return this;
  }

  public withEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }

  public withPassword(password: string): UserBuilder {
    this.user.password = password;
    return this;
  }

  public withRole(role: UserRole): UserBuilder {
    this.user.role = role;
    return this;
  }

  public build(): User {
    return this.user;
  }
}
