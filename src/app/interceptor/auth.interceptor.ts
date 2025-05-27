import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    // URL yang tidak perlu disisipkan Authorization header
    const excludedUrls = [
      '/api/auth/login' // jika ada
    ];

    // Cek apakah URL request termasuk yang dikecualikan
    const isExcluded = excludedUrls.some(url => req.url.includes(url));

    if (token && !isExcluded) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedReq);
    }

    return next.handle(req);
  }
}
