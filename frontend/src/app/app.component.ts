import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { IsInRoleDirective } from './dir/is.in.role.dir';
import { AppAuthService } from './service/app.auth.service';
import { CurrentUserService } from './service/current.user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    MatIconButton,
    MatIcon,
    AppHeaderComponent,
    MatDrawerContainer,
    MatDrawer,
    MatButton,
    RouterLink,
    RouterOutlet,
    IsInRoleDirective
  ]
})
export class AppComponent implements OnInit {
  private authService = inject(AppAuthService);
  private currentUserService = inject(CurrentUserService);

  useralias = signal('');

  private userLoaded = false;

  ngOnInit(): void {
    this.authService.useraliasObservable.subscribe(alias => {
      this.useralias.set(alias);
    });

    // Sobald ein Token vorliegt, die lokale userId nachladen.
    this.authService.accessTokenObservable.subscribe(token => {
      if (token) {
        if (!this.userLoaded) {
          this.userLoaded = true;
          this.currentUserService.load();
        }
      } else {
        this.userLoaded = false;
        this.currentUserService.clear();
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
