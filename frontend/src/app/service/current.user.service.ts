import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../dataaccess/user';
import { UserService } from './user.service';

/**
 * Hält den angemeldeten Benutzer inklusive seiner lokalen userId.
 *
 * Das Access-Token enthält nur die Keycloak-UUID. Alle benutzerbezogenen
 * Endpoints (/api/users/{userId}/...) brauchen aber die numerische ID aus der
 * Datenbank, die es ausschliesslich über GET /api/users/me gibt.
 *
 * Kein Gegenstück im Demoprojekt — dort wird keine benutzerbezogene Ressource geladen.
 */
@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private userService = inject(UserService);

  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public readonly currentUserObservable: Observable<User | null> = this.currentUserSubject.asObservable();

  public load(): void {
    this.userService.getMe().subscribe({
      next: user => this.currentUserSubject.next(user),
      error: () => this.currentUserSubject.next(null)
    });
  }

  public clear(): void {
    this.currentUserSubject.next(null);
  }

  public get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  public get userId(): number | undefined {
    return this.currentUserSubject.value?.userId;
  }
}
