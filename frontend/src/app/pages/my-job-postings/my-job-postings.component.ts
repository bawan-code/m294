import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
import { JobPosting } from '../../dataaccess/job-posting';
import { CurrentUserService } from '../../service/current.user.service';
import { HeaderService } from '../../service/header.service';
import { JobPostingService } from '../../service/job-posting.service';

@Component({
  selector: 'app-my-job-postings',
  templateUrl: './my-job-postings.component.html',
  styleUrls: ['./my-job-postings.component.scss'],
  imports: [
    MatToolbar, MatButton, MatIcon, DatePipe,
    MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell,
    MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator
  ]
})
export class MyJobPostingsComponent extends BaseComponent implements OnInit, AfterViewInit {
  private jobPostingService = inject(JobPostingService);
  private currentUserService = inject(CurrentUserService);
  private headerService = inject(HeaderService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  jobDataSource = new MatTableDataSource<JobPosting>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['title', 'location', 'salaryRange', 'createdAt', 'actions'];

  private userId?: number;

  public constructor() {
    super();

    this.headerService.setPage('Meine Inserate');
  }

  ngOnInit() {
    this.currentUserService.currentUserObservable.subscribe(user => {
      if (user) {
        this.userId = user.userId;
        this.reloadData();
      }
    });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.jobDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    if (this.userId === undefined) {
      return;
    }

    this.jobPostingService.getListByUser(this.userId).subscribe(obj => {
      this.jobDataSource.data = obj;
    });
  }

  async add() {
    await this.router.navigate(['job-posting']);
  }

  async edit(e: JobPosting) {
    await this.router.navigate(['job-posting', e.jobId]);
  }

  async applications(e: JobPosting) {
    await this.router.navigate(['job-postings', e.jobId, 'applications']);
  }

  delete(e: JobPosting) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Sind Sie sicher?',
        message: 'Möchten Sie dieses Inserat wirklich löschen?'
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.jobPostingService.delete(e.jobId).subscribe({
          next: response => {
            if (response.status === 200 || response.status === 204) {
              this.snackBar.open(this.deletedMessage, this.closeMessage, { duration: 5000 });
              this.reloadData();
            } else {
              this.snackBar.open(this.deleteErrorMessage, this.closeMessage, { duration: 5000 });
            }
          },
          error: () => this.snackBar.open(this.deleteErrorMessage, this.closeMessage, {
            duration: 5000,
            politeness: 'assertive'
          })
        });
      }
    });
  }
}
