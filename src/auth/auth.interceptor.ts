import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {catchError, from, Observable, switchMap, throwError} from "rxjs";
import {EndpointsUtils} from '../app/utils/EndpointsUtils';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  req = req.clone(
    {
      headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token') || '')
    }
  );

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        return from(fetch(EndpointsUtils.getPathGenToken())
          .then((res) => res.json())
        ).pipe(
          switchMap((res: any) => {
            const newToken = res?.token;
            localStorage.setItem('token', newToken);

            // Clone the request with the new token
            const clonedReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${newToken}`)
            });

            // Retry the request with the new token
            return next(clonedReq);
          })
        );
      }
      // Rethrow the original error for other status codes
      return throwError(() => error);
    })
  );


}
