import { Component, inject, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from '../../components/base/base.component';
import { User } from '../../dataaccess/user';
import { AutofocusDirective } from '../../dir/autofocus-dir';
import { CurrentUserService } from '../../service/current.user.service';
import { HeaderService } from '../../service/header.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
    MatButton, FormsModule, ReactiveFormsModule,
    MatFormField, MatLabel, MatInput, MatHint, MatError, AutofocusDirective
  ]
})
export class ProfileComponent extends BaseComponent implements OnInit {
  private userService = inject(UserService);
  private currentUserService = inject(CurrentUserService);
  private headerService = inject(HeaderService);
  private snackBar = inject(MatSnackBar);

  user = new User();

  public objForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(100)
    ]),
    email: new UntypedFormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(150)
    ]),
    // Nur zur Anzeige: Das Backend akzeptiert beim Update ausschliesslich name und email.
    role: new UntypedFormControl({ value: '', disabled: true })
  });

  constructor() {
    super();

    this.headerService.setPage('Mein Profil');
  }

  ngOnInit(): void {
    this.currentUserService.currentUserObservable.subscribe(user => {
      if (user) {
        this.user = user;
        this.objForm.patchValue(user);
      }
    });
  }

  save(formData: any) {
    const updated: User = Object.assign(new User(), this.user, formData);

    this.userService.update(updated).subscribe({
      next: () => {
        this.snackBar.open(this.messageSaved, this.messageClose, { duration: 5000 });
        // Damit Header und andere Seiten den neuen Namen sehen.
        this.currentUserService.load();
      },
      error: () => this.snackBar.open(this.messageError, this.messageClose, {
        duration: 5000,
        politeness: 'assertive'
      })
    });
  }
}
