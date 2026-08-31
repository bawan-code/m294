import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { MatToolbar } from '@angular/material/toolbar';
import { BaseComponent } from '../../components/base/base.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { JobApplication } from '../../dataaccess/job-application';
import { Status } from '../../dataaccess/status';
import { HeaderService } from '../../service/header.service';
import { JobApplicationService } from '../../service/job-application.service';
import { JobPostingService } from '../../service/job-posting.service';

@Component({
  selector: 'app-job-posting-applications',
  templateUrl: './job-posting-applications.component.html',
  styleUrls: ['./job-posting-applications.component.scss'],
  imports: [
    MatToolbar, MatButton, MatIcon, StatusBadgeComponent, DatePipe,
    MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell,
    MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator
  ]
})
export class JobPostingApplicationsComponent extends BaseComponent implements OnInit, AfterViewInit {
  private jobApplicationService = inject(JobApplicationService);
  private jobPostingService = inject(JobPostingService);
  private headerService = inject(HeaderService);
  private dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  applicationDataSource = new MatTableDataSource<JobApplication>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['jobSeekerName', 'jobSeekerEmail', 'status', 'appliedAt', 'actions'];

  jobTitle = '';
  private jobId?: number;

  public constructor() {
    super();

    this.headerService.setPage('Bewerbungen');
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== null) {
      this.jobId = Number.parseInt(id);

      this.jobPostingService.getOne(this.jobId).subscribe(obj => {
        this.jobTitle = obj.title;
      });

      this.reloadData();
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.applicationDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    if (this.jobId === undefined) {
      return;
    }

    this.jobApplicationService.getListByJob(this.jobId).subscribe(obj => {
      this.applicationDataSource.data = obj;
    });
  }

  async back() {
    await this.router.navigate(['my-job-postings']);
  }

  accept(e: JobApplication) {
    this.changeStatus(e, 'ACCEPTED', 'Bewerbung annehmen', 'Möchten Sie diese Bewerbung annehmen?');
  }

  reject(e: JobApplication) {
    this.changeStatus(e, 'REJECTED', 'Bewerbung ablehnen', 'Möchten Sie diese Bewerbung ablehnen?');
  }

  private changeStatus(e: JobApplication, status: Status, title: string, message: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: { title, message }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.jobApplicationService.updateStatus(e.applicationId, status).subscribe({
          next: () => {
            this.snackBar.open(this.messageSaved, this.messageClose, { duration: 5000 });
            this.reloadData();
          },
          error: () => this.snackBar.open(this.messageError, this.messageClose, {
            duration: 5000,
            politeness: 'assertive'
          })
        });
      }
    });
  }
}
