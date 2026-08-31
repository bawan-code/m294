import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { IsInRoleDirective } from './dir/is.in.role.dir';
import { AppAuthService } from './service/app.auth.service';

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

  useralias = signal('');

  ngOnInit(): void {
    this.authService.useraliasObservable.subscribe(alias => {
      this.useralias.set(alias);
    });
  }

  logout() {
    this.authService.logout();
  }
}
