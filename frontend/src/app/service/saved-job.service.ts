import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SavedJob } from '../dataaccess/saved-job';

@Injectable({
  providedIn: 'root'
})
export class SavedJobService {
  private http = inject(HttpClient);

  public static readonly backendUrl = 'saved-jobs';

  public getList(): Observable<SavedJob[]> {
    return this.http.get<SavedJob[]>(environment.backendBaseUrl + SavedJobService.backendUrl);
  }

  public getOne(id: number): Observable<SavedJob> {
    return this.http.get<SavedJob>(environment.backendBaseUrl + SavedJobService.backendUrl + `/${id}`);
  }

  /** Der Benutzer wird serverseitig aus dem Token bestimmt, deshalb nur die jobId. */
  public save(jobId: number): Observable<SavedJob> {
    return this.http.post<SavedJob>(environment.backendBaseUrl + SavedJobService.backendUrl, { jobId });
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(
      environment.backendBaseUrl + SavedJobService.backendUrl + `/${id}`,
      { observe: 'response' }
    );
  }

  public getListByUser(userId: number): Observable<SavedJob[]> {
    return this.http.get<SavedJob[]>(environment.backendBaseUrl + `users/${userId}/saved-jobs`);
  }
}
