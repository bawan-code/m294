import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HeaderService } from '../../service/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  private headerService = inject(HeaderService);

  currentPage = '';
  private subPage?: Subscription;

  ngOnInit() {
    this.subPage = this.headerService.pageObservable.subscribe(page => {
      this.currentPage = page;
    });
  }

  ngOnDestroy(): void {
    this.subPage?.unsubscribe();
  }
}
