import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';
import { expect, vi } from 'vitest';
import { authConfig } from '../../app.config';
import { environment } from '../../../environments/environment';
import { JobPosting } from '../../dataaccess/job-posting';
import { JobPostingService } from '../../service/job-posting.service';
import { SavedJobService } from '../../service/saved-job.service';
import { JobListComponent } from './job-list.component';

describe('JobListComponent', () => {
  let component: JobListComponent;
  let fixture: ComponentFixture<JobListComponent>;
  let httpMock: HttpTestingController;
  let router: { navigate: ReturnType<typeof vi.fn> };

  const jobListUrl = environment.backendBaseUrl + JobPostingService.backendUrl;
  const savedJobUrl = environment.backendBaseUrl + SavedJobService.backendUrl;

  function createJobPosting(jobId: number, title: string): JobPosting {
    const jobPosting = new JobPosting();

    jobPosting.jobId = jobId;
    jobPosting.title = title;
    jobPosting.location = 'Zürich';
    jobPosting.salaryRange = '90000 - 110000 CHF';
    jobPosting.employerName = 'employer';

    return jobPosting;
  }

  const fakeJobPostings: JobPosting[] = [
    createJobPosting(1, 'Senior Java Entwickler'),
    createJobPosting(2, 'Frontend Entwicklerin Angular'),
  ];

  beforeEach(async () => {
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        OAuthModule.forRoot({ resourceServer: { sendAccessToken: true } }),
        JobListComponent,
      ],
      providers: [
        // Ohne withInterceptorsFromDi(): Mit der DI-Interceptor-Kette erreichen die
        // Requests den HttpTestingController nicht. Das Demoprojekt setzt sie zwar,
        // prüft in seinen Komponententests aber keine HTTP-Aufrufe.
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthConfig, useValue: authConfig },
        { provide: Router, useValue: router },
      ],
      teardown: { destroyAfterEach: true },
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit sollte die Stellenliste laden', () => {
    component.ngOnInit();

    const req = httpMock.expectOne(jobListUrl);
    expect(req.request.method).toBe('GET');
    req.flush(fakeJobPostings);

    expect(component.jobDataSource.data).toHaveLength(2);
  });

  it('reloadData sollte die Datenquelle neu befüllen', () => {
    component.reloadData();

    httpMock.expectOne(jobListUrl).flush(fakeJobPostings);
    expect(component.jobDataSource.data[0].title).toEqual('Senior Java Entwickler');
  });

  it('ngAfterViewInit sollte den Paginator verbinden', () => {
    fixture.detectChanges();
    httpMock.expectOne(jobListUrl).flush(fakeJobPostings);

    component.ngAfterViewInit();

    expect(component.jobDataSource.paginator).toBeTruthy();
  });

  it('details sollte auf die Detailseite navigieren', async () => {
    await component.details(fakeJobPostings[0]);

    expect(router.navigate).toHaveBeenCalledWith(['jobs', 1]);
  });

  it('add sollte auf das Erfassungsformular navigieren', async () => {
    await component.add();

    expect(router.navigate).toHaveBeenCalledWith(['job-posting']);
  });

  it('saveJob sollte die Stelle auf die Merkliste setzen', () => {
    component.saveJob(fakeJobPostings[0]);

    const req = httpMock.expectOne(savedJobUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ jobId: 1 });
    req.flush({});
  });
});
