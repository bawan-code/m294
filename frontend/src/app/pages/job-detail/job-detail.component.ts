import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbar } from '@angular/material/toolbar';
import { BaseComponent } from '../../components/base/base.component';
import { JobPosting } from '../../dataaccess/job-posting';
import { IsInRoleDirective } from '../../dir/is.in.role.dir';
import { HeaderService } from '../../service/header.service';
import { JobApplicationService } from '../../service/job-application.service';
import { JobPostingService } from '../../service/job-posting.service';
import { SavedJobService } from '../../service/saved-job.service';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss'],
  imports: [MatToolbar, MatButton, MatIcon, IsInRoleDirective, DatePipe]
})
export class JobDetailComponent extends BaseComponent implements OnInit {
  private jobPostingService = inject(JobPostingService);
  private jobApplicationService = inject(JobApplicationService);
  private savedJobService = inject(SavedJobService);
  private headerService = inject(HeaderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  jobPosting = signal(new JobPosting());

  constructor() {
    super();

    this.headerService.setPage('Stellendetail');
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== null) {
      this.jobPostingService.getOne(Number.parseInt(id)).subscribe(obj => {
        this.jobPosting.set(obj);
      });
    }
  }

  async back() {
    await this.router.navigate(['jobs']);
  }

  apply() {
    this.jobApplicationService.save(this.jobPosting().jobId).subscribe({
      next: () => this.snackBar.open('Bewerbung eingereicht', this.messageClose, { duration: 5000 }),
      error: () => this.snackBar.open('Bewerbung fehlgeschlagen', this.messageClose, {
        duration: 5000,
        politeness: 'assertive'
      })
    });
  }

  saveJob() {
    this.savedJobService.save(this.jobPosting().jobId).subscribe({
      next: () => this.snackBar.open('Stelle gemerkt', this.messageClose, { duration: 5000 }),
      error: () => this.snackBar.open('Stelle konnte nicht gemerkt werden', this.messageClose, {
        duration: 5000,
        politeness: 'assertive'
      })
    });
  }
}
