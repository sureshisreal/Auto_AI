import { faker } from '@faker-js/faker';
import { Job } from '../models/Job.model';

export class JobBuilder {
  private job: Job = {
    title: faker.person.jobTitle(),
    description: faker.lorem.paragraph(2),
    salary: faker.number.int({ min: 60000, max: 200000 }),
    location: faker.location.city()
  };

  public withTitle(title: string): JobBuilder {
    this.job.title = title;
    return this;
  }

  public withDescription(description: string): JobBuilder {
    this.job.description = description;
    return this;
  }

  public withSalary(salary: number): JobBuilder {
    this.job.salary = salary;
    return this;
  }

  public withLocation(location: string): JobBuilder {
    this.job.location = location;
    return this;
  }

  public build(): Job {
    return this.job;
  }
}
