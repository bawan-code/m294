import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from 'vitest';
import { environment } from '../../environments/environment';
import { JobPosting } from '../dataaccess/job-posting';
import { JobPostingService } from './job-posting.service';

describe('JobPostingService', () => {
  let service: JobPostingService;
  let httpMock: HttpTestingController;

  const baseUrl = environment.backendBaseUrl + JobPostingService.backendUrl;

  function createJobPosting(jobId: number, title: string): JobPosting {
    const jobPosting = new JobPosting();

    jobPosting.jobId = jobId;
    jobPosting.title = title;
    jobPosting.description = 'Eine ausreichend lange Beschreibung.';
    jobPosting.location = 'Zürich';
    jobPosting.salaryRange = '90000 - 110000 CHF';
    jobPosting.employerId = 2;
    jobPosting.employerName = 'employer';

    return jobPosting;
  }

  const fakeJobPostings: JobPosting[] = [
    createJobPosting(1, 'Senior Java Entwickler'),
    createJobPosting(2, 'Frontend Entwicklerin Angular'),
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      teardown: { destroyAfterEach: true },
    });
    service = TestBed.inject(JobPostingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Stellt sicher, dass kein zusätzlicher Request abgesetzt wurde.
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getList sollte alle Stelleninserate liefern', () => {
    service.getList().subscribe({
      next: data => {
        expect(data).toHaveLength(fakeJobPostings.length);
      },
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(fakeJobPostings);
  });

  it('getOne sollte ein einzelnes Stelleninserat liefern', () => {
    service.getOne(1).subscribe({
      next: data => {
        expect(data.title).toEqual('Senior Java Entwickler');
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(fakeJobPostings[0]);
  });

  it('save sollte ein neues Stelleninserat anlegen', () => {
    const newJobPosting = createJobPosting(3, 'DevOps Engineer');

    service.save(newJobPosting).subscribe({
      next: data => {
        expect(data).toEqual(newJobPosting);
      },
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newJobPosting);
  });

  it('update sollte ein bestehendes Stelleninserat aktualisieren', () => {
    const jobPosting = createJobPosting(1, 'Senior Java Entwickler');
    jobPosting.title = 'Lead Java Entwickler';

    service.update(jobPosting).subscribe({
      next: data => {
        expect(data.title).toEqual('Lead Java Entwickler');
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(jobPosting);
  });

  it('delete sollte ein Stelleninserat löschen', () => {
    service.delete(1).subscribe({
      next: response => {
        // Das Backend antwortet mit 204 No Content.
        expect(response.status).toBe(204);
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('getListByUser sollte die Inserate eines Arbeitgebers liefern', () => {
    service.getListByUser(2).subscribe({
      next: data => {
        expect(data).toHaveLength(fakeJobPostings.length);
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + 'users/2/job-postings');
    expect(req.request.method).toBe('GET');
    req.flush(fakeJobPostings);
  });
});
