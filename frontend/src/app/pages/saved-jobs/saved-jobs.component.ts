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
import { BaseComponent } from '../../components/base/base.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { SavedJob } from '../../dataaccess/saved-job';
import { CurrentUserService } from '../../service/current.user.service';
import { HeaderService } from '../../service/header.service';
import { SavedJobService } from '../../service/saved-job.service';

@Component({
  selector: 'app-saved-jobs',
  templateUrl: './saved-jobs.component.html',
  styleUrls: ['./saved-jobs.component.scss'],
  imports: [
    MatButton, MatIcon, DatePipe,
    MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell,
    MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator
  ]
})
export class SavedJobsComponent extends BaseComponent implements OnInit, AfterViewInit {
  private savedJobService = inject(SavedJobService);
  private currentUserService = inject(CurrentUserService);
  private headerService = inject(HeaderService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  savedJobDataSource = new MatTableDataSource<SavedJob>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['jobTitle', 'jobLocation', 'salaryRange', 'employerName', 'savedAt', 'actions'];

  private userId?: number;

  public constructor() {
    super();

    this.headerService.setPage('Gemerkte Jobs');
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
      this.savedJobDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    if (this.userId === undefined) {
      return;
    }

    this.savedJobService.getListByUser(this.userId).subscribe(obj => {
      this.savedJobDataSource.data = obj;
    });
  }

  async toJob(e: SavedJob) {
    await this.router.navigate(['jobs', e.jobId]);
  }

  remove(e: SavedJob) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Sind Sie sicher?',
        message: 'Möchten Sie diese Stelle wirklich aus der Merkliste entfernen?'
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.savedJobService.delete(e.savedJobId).subscribe({
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
