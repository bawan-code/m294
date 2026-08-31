import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { JobApplication } from '../../dataaccess/job-application';
import { CurrentUserService } from '../../service/current.user.service';
import { HeaderService } from '../../service/header.service';
import { JobApplicationService } from '../../service/job-application.service';

@Component({
  selector: 'app-my-applications',
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.scss'],
  imports: [
    MatButton, MatIcon, StatusBadgeComponent, DatePipe,
    MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell,
    MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator
  ]
})
export class MyApplicationsComponent extends BaseComponent implements OnInit, AfterViewInit {
  private jobApplicationService = inject(JobApplicationService);
  private currentUserService = inject(CurrentUserService);
  private headerService = inject(HeaderService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  applicationDataSource = new MatTableDataSource<JobApplication>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['jobTitle', 'employerName', 'status', 'appliedAt', 'actions'];

  private userId?: number;

  public constructor() {
    super();

    this.headerService.setPage('Meine Bewerbungen');
  }

  ngOnInit() {
    // Die userId trifft erst mit der Antwort von /api/users/me ein,
    // deshalb hier abonnieren statt synchron lesen.
    this.currentUserService.currentUserObservable.subscribe(user => {
      if (user) {
        this.userId = user.userId;
        this.reloadData();
      }
    });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.applicationDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    if (this.userId === undefined) {
      return;
    }

    this.jobApplicationService.getListByUser(this.userId).subscribe(obj => {
      this.applicationDataSource.data = obj;
    });
  }

  withdraw(e: JobApplication) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Bewerbung zurückziehen',
        message: 'Möchten Sie diese Bewerbung wirklich zurückziehen?'
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.jobApplicationService.delete(e.applicationId).subscribe({
          next: response => {
            // Das Backend antwortet auf DELETE mit 204 No Content.
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
