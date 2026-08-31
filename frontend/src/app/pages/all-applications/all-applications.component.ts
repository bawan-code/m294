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
import { Status } from '../../dataaccess/status';
import { HeaderService } from '../../service/header.service';
import { JobApplicationService } from '../../service/job-application.service';

/**
 * Globale Sicht auf alle Bewerbungen, nur für ADMIN.
 * Kommt ohne userId aus und ist deshalb die passende Admin-Ansicht:
 * Administratoren existieren nur in Keycloak, nicht in der lokalen Datenbank.
 */
@Component({
  selector: 'app-all-applications',
  templateUrl: './all-applications.component.html',
  styleUrls: ['./all-applications.component.scss'],
  imports: [
    MatButton, MatIcon, StatusBadgeComponent, DatePipe,
    MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell,
    MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator
  ]
})
export class AllApplicationsComponent extends BaseComponent implements OnInit, AfterViewInit {
  private jobApplicationService = inject(JobApplicationService);
  private headerService = inject(HeaderService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  applicationDataSource = new MatTableDataSource<JobApplication>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['jobTitle', 'employerName', 'jobSeekerName', 'status', 'appliedAt', 'actions'];

  public constructor() {
    super();

    this.headerService.setPage('Alle Bewerbungen');
  }

  ngOnInit() {
    this.reloadData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.applicationDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    this.jobApplicationService.getList().subscribe(obj => {
      this.applicationDataSource.data = obj;
    });
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
