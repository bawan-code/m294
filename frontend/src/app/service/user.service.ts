import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../dataaccess/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  public static readonly backendUrl = 'users';

  public getList(): Observable<User[]> {
    return this.http.get<User[]>(environment.backendBaseUrl + UserService.backendUrl);
  }

  public getOne(id: number): Observable<User> {
    return this.http.get<User>(environment.backendBaseUrl + UserService.backendUrl + `/${id}`);
  }

  /** Liefert den angemeldeten Benutzer inklusive der lokalen userId. */
  public getMe(): Observable<User> {
    return this.http.get<User>(environment.backendBaseUrl + UserService.backendUrl + '/me');
  }

  public update(user: User): Observable<User> {
    return this.http.put<User>(
      environment.backendBaseUrl + UserService.backendUrl + `/${user.userId}`,
      user
    );
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(
      environment.backendBaseUrl + UserService.backendUrl + `/${id}`,
      { observe: 'response' }
    );
  }
}
