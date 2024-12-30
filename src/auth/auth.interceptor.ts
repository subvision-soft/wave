import {HttpClient, HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {inject} from "@angular/core";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    req = req.clone();
    return next(req).pipe(
        catchError((error) => {
            if (error.status === 401) {
                inject(HttpClient).get('/api/generate-token').pipe(
                    switchMap(() => {
                        return next(req);
                    })
                );
            }
            return throwError(error);
        })
    );

}
