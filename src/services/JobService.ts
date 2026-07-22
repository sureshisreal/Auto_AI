import { ApiClient } from '../api/ApiClient';
import { API_ENDPOINTS } from '../testdata/apiEndpoints.testdata';
import { Job } from '../models/Job.model';
import { ApiResponse } from '../models/ApiResponse.model';

/**
 * Service layer wrapping ApiClient for job-related API calls (wesendcv
 * domain). Keeps business/API sequencing out of test files and page objects.
 */
export class JobService {
  constructor(private readonly apiClient: ApiClient) {}

  public async createJob(job: Job): Promise<ApiResponse<Job>> {
    const response = await this.apiClient.post(API_ENDPOINTS.wesendcv.jobs.create, job);
    const body = await this.apiClient.getJson<Job>(response);
    return { status: response.status(), ok: response.ok(), body };
  }

  public async listJobs(): Promise<ApiResponse<Job[]>> {
    const response = await this.apiClient.get(API_ENDPOINTS.wesendcv.jobs.list);
    const body = await this.apiClient.getJson<Job[]>(response);
    return { status: response.status(), ok: response.ok(), body };
  }

  public async getJobById(id: number): Promise<ApiResponse<Job>> {
    const endpoint = API_ENDPOINTS.wesendcv.jobs.detail.replace(':id', String(id));
    const response = await this.apiClient.get(endpoint);
    const body = await this.apiClient.getJson<Job>(response);
    return { status: response.status(), ok: response.ok(), body };
  }
}
