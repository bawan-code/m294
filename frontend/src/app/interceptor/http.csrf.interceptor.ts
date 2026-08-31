import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpXSRFInterceptor implements HttpInterceptor {
  private tokenExtractor = inject(HttpXsrfTokenExtractor);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Requests an Keycloak (Port 8080) brauchen kein XSRF-Token.
    if (!req.url.startsWith('http://localhost:8080')) {
      const headerName = 'X-XSRF-TOKEN';
      const token = this.tokenExtractor.getToken() as string;
      if (token !== null && !req.headers.has(headerName)) {
        req = req.clone({ headers: req.headers.set(headerName, token) });
      }
    }

    return next.handle(req);
  }
}
