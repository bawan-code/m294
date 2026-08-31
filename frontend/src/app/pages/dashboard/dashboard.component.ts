import { Component, inject, OnInit, signal } from '@angular/core';
import { AppLoginComponent } from '../../components/app-login/app-login.component';
import { AppAuthService } from '../../service/app.auth.service';
import { HeaderService } from '../../service/header.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [AppLoginComponent]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AppAuthService);
  private headerService = inject(HeaderService);

  username = signal('');
  useralias = signal('');

  constructor() {
    this.headerService.setPage('Dashboard');
  }

  ngOnInit(): void {
    this.authService.usernameObservable.subscribe(name => this.username.set(name));
    this.authService.useraliasObservable.subscribe(alias => this.useralias.set(alias));
  }
}
