import { faker } from '@faker-js/faker';

export const TEST_PAYLOADS = {
  job: {
    valid: () => ({
      title: faker.person.jobTitle(),
      description: faker.lorem.paragraph(2),
      salary: faker.number.int({ min: 60000, max: 200000 }),
      location: faker.location.city()
    }),
    invalid: () => ({
      title: '',
      description: faker.lorem.sentence(),
      salary: faker.number.int({ min: -1000, max: -1 })
    })
  },
  auth: {
    valid: () => ({
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12, memorable: false, pattern: /[A-Za-z0-9!@#$%^&*]/ })
    }),
    invalid: () => ({
      email: faker.internet.emoji(),
      password: ''
    })
  }
};
