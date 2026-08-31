import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JobPosting } from '../dataaccess/job-posting';

/**
 * Der Service mit dem vollständigen CRUD-Umfang.
 * Der Arbeitgeber wird beim Anlegen serverseitig aus dem Token bestimmt.
 */
@Injectable({
  providedIn: 'root'
})
export class JobPostingService {
  private http = inject(HttpClient);

  public static readonly backendUrl = 'job-postings';

  public getList(): Observable<JobPosting[]> {
    return this.http.get<JobPosting[]>(environment.backendBaseUrl + JobPostingService.backendUrl);
  }

  public getOne(id: number): Observable<JobPosting> {
    return this.http.get<JobPosting>(environment.backendBaseUrl + JobPostingService.backendUrl + `/${id}`);
  }

  public save(jobPosting: JobPosting): Observable<JobPosting> {
    return this.http.post<JobPosting>(environment.backendBaseUrl + JobPostingService.backendUrl, jobPosting);
  }

  public update(jobPosting: JobPosting): Observable<JobPosting> {
    return this.http.put<JobPosting>(
      environment.backendBaseUrl + JobPostingService.backendUrl + `/${jobPosting.jobId}`,
      jobPosting
    );
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(
      environment.backendBaseUrl + JobPostingService.backendUrl + `/${id}`,
      { observe: 'response' }
    );
  }

  public getListByUser(userId: number): Observable<JobPosting[]> {
    return this.http.get<JobPosting[]>(environment.backendBaseUrl + `users/${userId}/job-postings`);
  }
}
