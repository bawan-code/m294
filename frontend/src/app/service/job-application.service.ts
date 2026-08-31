import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JobApplication } from '../dataaccess/job-application';
import { Status } from '../dataaccess/status';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private http = inject(HttpClient);

  public static readonly backendUrl = 'job-applications';

  public getList(): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(environment.backendBaseUrl + JobApplicationService.backendUrl);
  }

  public getOne(id: number): Observable<JobApplication> {
    return this.http.get<JobApplication>(
      environment.backendBaseUrl + JobApplicationService.backendUrl + `/${id}`
    );
  }

  /** Der Bewerber wird serverseitig aus dem Token bestimmt, deshalb nur die jobId. */
  public save(jobId: number): Observable<JobApplication> {
    return this.http.post<JobApplication>(
      environment.backendBaseUrl + JobApplicationService.backendUrl,
      { jobId }
    );
  }

  public updateStatus(applicationId: number, status: Status): Observable<JobApplication> {
    return this.http.patch<JobApplication>(
      environment.backendBaseUrl + JobApplicationService.backendUrl + `/${applicationId}/status`,
      { status }
    );
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(
      environment.backendBaseUrl + JobApplicationService.backendUrl + `/${id}`,
      { observe: 'response' }
    );
  }

  public getListByUser(userId: number): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(environment.backendBaseUrl + `users/${userId}/job-applications`);
  }

  public getListByJob(jobId: number): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(environment.backendBaseUrl + `job-postings/${jobId}/job-applications`);
  }
}
