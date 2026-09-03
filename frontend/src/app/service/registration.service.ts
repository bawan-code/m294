import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RegisterRequest } from '../dataaccess/register-request';
import { User } from '../dataaccess/user';

/**
 * Spricht den öffentlichen Registrierungs-Endpoint an. Bewusst kein CRUD-Service:
 * deshalb heisst die Methode register() statt save() wie bei den Ressourcen-Services.
 *
 * Der Endpoint ist in SecurityConfig sowohl permitAll als auch von CSRF ausgenommen,
 * der Aufruf funktioniert also ohne Token und ohne XSRF-Header.
 */
@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private http = inject(HttpClient);

  public static readonly backendUrl = 'auth/register';

  public register(request: RegisterRequest): Observable<User> {
    return this.http.post<User>(environment.backendBaseUrl + RegistrationService.backendUrl, request);
  }
}
