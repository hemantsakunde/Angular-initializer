import {
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { inject } from '@angular/core';
import { DataService } from '../services/data.service';

export function httpInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const loader = inject(DataService).loader;
  return next(req).pipe(
    tap((event) => {
      loader.next(true);
      if (event.type === HttpEventType.Response) {
        if (event.status === 200) {
            loader.next(false);
        }
      }
    })
  );
}