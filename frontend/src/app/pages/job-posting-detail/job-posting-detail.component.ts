import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbar } from '@angular/material/toolbar';
import { BaseComponent } from '../../components/base/base.component';
import { JobPosting } from '../../dataaccess/job-posting';
import { AutofocusDirective } from '../../dir/autofocus-dir';
import { HeaderService } from '../../service/header.service';
import { JobPostingService } from '../../service/job-posting.service';

@Component({
  selector: 'app-job-posting-detail',
  templateUrl: './job-posting-detail.component.html',
  styleUrls: ['./job-posting-detail.component.scss'],
  imports: [
    MatToolbar, MatButton, MatIcon, FormsModule, ReactiveFormsModule,
    MatFormField, MatLabel, MatInput, MatHint, MatError,
    AutofocusDirective, CdkTextareaAutosize
  ]
})
export class JobPostingDetailComponent extends BaseComponent implements OnInit {
  private jobPostingService = inject(JobPostingService);
  private headerService = inject(HeaderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  jobPosting = new JobPosting();

  /**
   * Die FormGroup wird genau einmal mit ihren Validatoren aufgebaut und beim Laden
   * nur noch per patchValue befüllt. Ein formBuilder.group(obj) wie im Demoprojekt
   * würde die Gruppe ersetzen und dabei sämtliche Validatoren verlieren.
   */
  public objForm = new UntypedFormGroup({
    title: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
    ]),
    description: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(2000)
    ]),
    location: new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(100)
    ]),
    salaryRange: new UntypedFormControl('', [
      Validators.pattern(/^\d{1,7}\s*-\s*\d{1,7}(\s*[A-Za-z]{1,3})?$/)
    ])
  });

  constructor() {
    super();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== null) {
      this.headerService.setPage('Stelle bearbeiten');

      this.jobPostingService.getOne(Number.parseInt(id)).subscribe(obj => {
        this.jobPosting = obj;
        this.objForm.patchValue(obj);
      });
    } else {
      this.headerService.setPage('Neue Stelle erfassen');
    }
  }

  async back() {
    await this.router.navigate(['my-job-postings']);
  }

  save(formData: any) {
    const posting: JobPosting = Object.assign(new JobPosting(), this.jobPosting, formData);

    if (posting.jobId) {
      this.jobPostingService.update(posting).subscribe({
        next: () => {
          this.snackBar.open(this.messageSaved, this.messageClose, { duration: 5000 });
          this.back();
        },
        error: () => this.snackBar.open(this.messageError, this.messageClose, {
          duration: 5000,
          politeness: 'assertive'
        })
      });
    } else {
      this.jobPostingService.save(posting).subscribe({
        next: () => {
          this.snackBar.open(this.messageNewSaved, this.messageClose, { duration: 5000 });
          this.back();
        },
        error: () => this.snackBar.open(this.messageNewError, this.messageClose, {
          duration: 5000,
          politeness: 'assertive'
        })
      });
    }
  }
}
