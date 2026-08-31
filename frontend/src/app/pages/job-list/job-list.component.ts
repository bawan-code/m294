import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
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
import { JobPosting } from '../../dataaccess/job-posting';
import { IsInRoleDirective } from '../../dir/is.in.role.dir';
import { HeaderService } from '../../service/header.service';
import { JobPostingService } from '../../service/job-posting.service';
import { SavedJobService } from '../../service/saved-job.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  imports: [
    IsInRoleDirective, MatToolbar, MatButton, MatIcon,
    MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell,
    MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator
  ]
})
export class JobListComponent extends BaseComponent implements OnInit, AfterViewInit {
  private jobPostingService = inject(JobPostingService);
  private savedJobService = inject(SavedJobService);
  private headerService = inject(HeaderService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  jobDataSource = new MatTableDataSource<JobPosting>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['title', 'location', 'salaryRange', 'employerName', 'actions'];

  public constructor() {
    super();

    this.headerService.setPage('Stellen');
  }

  ngOnInit() {
    this.reloadData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.jobDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    this.jobPostingService.getList().subscribe(obj => {
      this.jobDataSource.data = obj;
    });
  }

  async details(e: JobPosting) {
    await this.router.navigate(['jobs', e.jobId]);
  }

  async add() {
    await this.router.navigate(['job-posting']);
  }

  saveJob(e: JobPosting) {
    this.savedJobService.save(e.jobId).subscribe({
      next: () => this.snackBar.open('Stelle gemerkt', this.messageClose, { duration: 5000 }),
      error: () => this.snackBar.open('Stelle konnte nicht gemerkt werden', this.messageClose, {
        duration: 5000,
        politeness: 'assertive'
      })
    });
  }
}
