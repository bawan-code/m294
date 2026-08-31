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
import { User } from '../../dataaccess/user';
import { HeaderService } from '../../service/header.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  imports: [
    MatButton, MatIcon, DatePipe,
    MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell,
    MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator
  ]
})
export class UserListComponent extends BaseComponent implements OnInit, AfterViewInit {
  private userService = inject(UserService);
  private headerService = inject(HeaderService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  userDataSource = new MatTableDataSource<User>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['name', 'email', 'role', 'createdAt', 'actions'];

  public constructor() {
    super();

    this.headerService.setPage('Benutzerverwaltung');
  }

  ngOnInit() {
    this.reloadData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.userDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    this.userService.getList().subscribe(obj => {
      this.userDataSource.data = obj;
    });
  }

  delete(e: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Sind Sie sicher?',
        message: 'Möchten Sie diesen Benutzer wirklich löschen?'
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.userService.delete(e.userId).subscribe({
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
