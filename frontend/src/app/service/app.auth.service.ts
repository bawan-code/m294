import { inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthConfig, OAuthErrorEvent, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppAuthService {
  private oauthService = inject(OAuthService);
  private authConfig = inject(AuthConfig);

  private jwtHelper: JwtHelperService = new JwtHelperService();

  private usernameSubject: BehaviorSubject<string> = new BehaviorSubject('');
  public readonly usernameObservable: Observable<string> = this.usernameSubject.asObservable();

  private useraliasSubject: BehaviorSubject<string> = new BehaviorSubject('');
  public readonly useraliasObservable: Observable<string> = this.useraliasSubject.asObservable();

  private accessTokenSubject: BehaviorSubject<string> = new BehaviorSubject('');
  public readonly accessTokenObservable: Observable<string> = this.accessTokenSubject.asObservable();

  private rolesSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor() {
    this.handleEvents(null);
  }

  private _decodedAccessToken: any;

  get decodedAccessToken() {
    return this._decodedAccessToken;
  }

  private _accessToken = '';

  get accessToken() {
    return this._accessToken;
  }

  async initAuth(): Promise<any> {
    return new Promise<void>(() => {
      this.oauthService.configure(this.authConfig);
      this.oauthService.events
        .subscribe(e => this.handleEvents(e));
      this.oauthService.loadDiscoveryDocumentAndTryLogin();
      this.oauthService.setupAutomaticSilentRefresh();
    });
  }

  /**
   * Die Rollen stammen aus dem Realm-Claim des Backends (realm_access.roles),
   * nicht aus resource_access wie im Demoprojekt.
   *
   * Als BehaviorSubject, damit Guards und Direktiven auch dann noch die Rollen
   * erhalten, wenn das Token erst nach ihrer Initialisierung eintrifft.
   */
  public getRoles(): Observable<string[]> {
    return this.rolesSubject.asObservable();
  }

  public getIdentityClaims(): Record<string, any> {
    return this.oauthService.getIdentityClaims();
  }

  public hasValidAccessToken(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  public logout() {
    this.oauthService.logOut();
    this.useraliasSubject.next('');
    this.usernameSubject.next('');
    this.rolesSubject.next([]);
    this.accessTokenSubject.next('');
  }

  public login() {
    this.oauthService.initLoginFlow();
  }

  private handleEvents(event: any) {
    if (event instanceof OAuthErrorEvent) {
      console.error(event);
      return;
    }

    this._accessToken = this.oauthService.getAccessToken();
    this.accessTokenSubject.next(this._accessToken);
    this._decodedAccessToken = this.jwtHelper.decodeToken(this._accessToken);

    this.rolesSubject.next(this.extractRealmRoles());

    if (this._decodedAccessToken?.family_name && this._decodedAccessToken?.given_name) {
      const username = this._decodedAccessToken.given_name + ' ' + this._decodedAccessToken.family_name;
      this.usernameSubject.next(username);
    }

    const claims = this.getIdentityClaims();
    if (claims !== null && claims['preferred_username'] !== '') {
      this.useraliasSubject.next(claims['preferred_username']);
    }
  }

  private extractRealmRoles(): string[] {
    const roles = this._decodedAccessToken?.realm_access?.roles;

    if (!Array.isArray(roles)) {
      return [];
    }

    return roles;
  }
}
