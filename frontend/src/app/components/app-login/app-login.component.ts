import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AppAuthService } from '../../service/app.auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.scss'],
  imports: [MatButton, MatIcon]
})
export class AppLoginComponent {
  private authService = inject(AppAuthService);

  public login() {
    this.authService.login();
  }
}
