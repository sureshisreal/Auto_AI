import { RandomDataUtils } from '../utils/RandomDataUtils';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export class UserBuilder {
  private userData: Partial<UserData> = {};

  constructor() {
    // Set default values
    this.userData = {
      firstName: RandomDataUtils.getRandomFirstName(),
      lastName: RandomDataUtils.getRandomLastName(),
      email: RandomDataUtils.getRandomEmail(),
      password: RandomDataUtils.getRandomPassword(),
      role: 'standard'
    };
  }

  public withFirstName(firstName: string): UserBuilder {
    this.userData.firstName = firstName;
    return this;
  }

  public withLastName(lastName: string): UserBuilder {
    this.userData.lastName = lastName;
    return this;
  }

  public withEmail(email: string): UserBuilder {
    this.userData.email = email;
    return this;
  }

  public withPassword(password: string): UserBuilder {
    this.userData.password = password;
    return this;
  }

  public withRole(role: string): UserBuilder {
    this.userData.role = role;
    return this;
  }

  public build(): UserData {
    return this.userData as UserData;
  }
}
