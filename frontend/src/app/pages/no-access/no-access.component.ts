import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { OAuthService } from 'angular-oauth2-oidc';
import { AppLoginComponent } from '../../components/app-login/app-login.component';
import { HeaderService } from '../../service/header.service';

@Component({
  selector: 'app-no-access',
  templateUrl: './no-access.component.html',
  styleUrls: ['./no-access.component.scss'],
  imports: [MatIcon, AppLoginComponent]
})
export class NoAccessComponent {
  private headerService = inject(HeaderService);

  oauthService = inject(OAuthService);

  constructor() {
    this.headerService.setPage('Kein Zugriff');
  }
}
