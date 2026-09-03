import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from 'vitest';
import { environment } from '../../environments/environment';
import { RegisterRequest } from '../dataaccess/register-request';
import { RegistrationService } from './registration.service';

describe('RegistrationService', () => {
  let service: RegistrationService;
  let httpMock: HttpTestingController;

  const registerUrl = environment.backendBaseUrl + RegistrationService.backendUrl;

  function createRequest(): RegisterRequest {
    const request = new RegisterRequest();

    request.name = 'Anna Beispiel';
    request.email = 'anna@example.ch';
    request.password = 'geheim12345';
    request.role = 'JOB_SEEKER';

    return request;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      teardown: { destroyAfterEach: true },
    });
    service = TestBed.inject(RegistrationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('register sollte den Benutzer anlegen', () => {
    const request = createRequest();

    service.register(request).subscribe({
      next: user => {
        expect(user.email).toEqual('anna@example.ch');
        expect(user.role).toEqual('JOB_SEEKER');
      },
    });

    const req = httpMock.expectOne(registerUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({ userId: 3, email: 'anna@example.ch', role: 'JOB_SEEKER' });
  });

  it('register sollte 409 bei bereits vergebener E-Mail durchreichen', () => {
    let status = 0;

    service.register(createRequest()).subscribe({
      error: (error: HttpErrorResponse) => {
        status = error.status;
      },
    });

    httpMock.expectOne(registerUrl).flush(null, { status: 409, statusText: 'Conflict' });
    expect(status).toBe(409);
  });

  it('register sollte 400 bei ungültigen Eingaben durchreichen', () => {
    let status = 0;

    service.register(createRequest()).subscribe({
      error: (error: HttpErrorResponse) => {
        status = error.status;
      },
    });

    httpMock.expectOne(registerUrl).flush(null, { status: 400, statusText: 'Bad Request' });
    expect(status).toBe(400);
  });
});
