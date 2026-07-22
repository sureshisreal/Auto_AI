import { faker } from '@faker-js/faker';

export class RandomDataUtils {
  public static getRandomEmail(): string {
    return faker.internet.email();
  }

  public static getRandomPassword(): string {
    return faker.internet.password({
      length: 12,
      memorable: false,
      pattern: /[A-Za-z0-9!@#$%^&*]/
    });
  }

  public static getRandomFirstName(): string {
    return faker.person.firstName();
  }

  public static getRandomLastName(): string {
    return faker.person.lastName();
  }

  public static getRandomPhoneNumber(): string {
    return faker.phone.number();
  }

  public static getRandomNumber(min: number, max: number): number {
    return faker.number.int({ min, max });
  }

  public static getRandomText(wordCount: number = 5): string {
    return faker.word.words(wordCount);
  }
}
