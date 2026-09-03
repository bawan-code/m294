import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OAuthService } from 'angular-oauth2-oidc';
import { BaseComponent } from '../../components/base/base.component';
import { RegisterRequest } from '../../dataaccess/register-request';
import { AutofocusDirective } from '../../dir/autofocus-dir';
import { AppAuthService } from '../../service/app.auth.service';
import { HeaderService } from '../../service/header.service';
import { RegistrationService } from '../../service/registration.service';

/**
 * Prüft, ob die beiden Passwortfelder übereinstimmen. Der Fehler hängt an der
 * Gruppe, nicht an einem einzelnen Control.
 */
export function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const passwordConfirm = group.get('passwordConfirm')?.value;

  if (!password || !passwordConfirm) {
    return null;
  }

  return password === passwordConfirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    MatButton, MatIcon, FormsModule, ReactiveFormsModule,
    MatFormField, MatLabel, MatInput, MatHint, MatError,
    MatSelect, MatOption, AutofocusDirective
  ]
})
export class RegisterComponent extends BaseComponent implements OnInit {
  private registrationService = inject(RegistrationService);
  private authService = inject(AppAuthService);
  private oauthService = inject(OAuthService);
  private headerService = inject(HeaderService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  /** Sperrt den Button während des Requests — der stallt ausgeloggt rund eine Sekunde. */
  submitting = signal(false);

  /** Nach Erfolg wird das Formular durch die Bestätigung ersetzt. */
  registered = signal(false);

  public objForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100)
    ]),
    email: new UntypedFormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(150)
    ]),
    password: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(64)
    ]),
    passwordConfirm: new UntypedFormControl('', [
      Validators.required
    ]),
    role: new UntypedFormControl('JOB_SEEKER', [
      Validators.required
    ])
  }, { validators: passwordsMatchValidator });

  constructor() {
    super();

    this.headerService.setPage('Registrieren');
  }

  ngOnInit(): void {
    // Eine Registrierung im angemeldeten Zustand ergibt keinen Sinn.
    if (this.oauthService.hasValidAccessToken()) {
      this.router.navigate(['dashboard']);
    }
  }

  register(formData: any) {
    const request: RegisterRequest = Object.assign(new RegisterRequest(), {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });

    this.submitting.set(true);

    this.registrationService.register(request).subscribe({
      next: () => {
        this.registered.set(true);
        this.snackBar.open('Konto erstellt', this.messageClose, { duration: 5000 });
      },
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);
        this.snackBar.open(this.errorMessageFor(error), this.messageClose, {
          duration: 5000,
          politeness: 'assertive'
        });
      }
    });
  }

  login() {
    this.authService.login();
  }

  private errorMessageFor(error: HttpErrorResponse): string {
    if (error.status === 409) {
      return 'Diese E-Mail-Adresse ist bereits registriert.';
    }

    if (error.status === 400) {
      return 'Bitte prüfen Sie Ihre Eingaben.';
    }

    return this.messageNewError;
  }
}
