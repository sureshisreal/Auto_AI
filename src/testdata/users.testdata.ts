import { faker } from '@faker-js/faker';
import Config from '../config/Config';

/**
 * Named user fixtures. ADMIN/STANDARD are sourced from Config (env-driven,
 * never hardcoded); INVALID/RANDOM are generated lazily per call so parallel
 * workers never share mutable state.
 */
export const USERS = {
  ADMIN: () => ({ email: Config.adminUsername, password: Config.adminPassword }),
  STANDARD: () => ({ email: Config.standardUsername, password: Config.standardPassword }),
  INVALID: () => ({
    email: faker.internet.email({ firstName: 'invalid', lastName: 'user', provider: 'invalid-domain' }),
    password: faker.internet.password({ length: 4, memorable: false })
  }),
  RANDOM: () => ({
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12, memorable: false, pattern: /[A-Za-z0-9!@#$%^&*]/ }),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName()
  })
};
