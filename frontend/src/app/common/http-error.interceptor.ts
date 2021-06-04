import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService,
        private notificationService: NotificationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //console.log('intercepting:' + request);
        return next.handle(request)
            .pipe(
                retry(0),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        this.notificationService.error(error.error.message);
                    } else {
                        // server-side error
                        this.performError(error);
                    }                    
                    return throwError(errorMessage);
                })
            )
    }

    private performError(error: HttpErrorResponse) {
        switch (error.status) {
            case 404:
                this.notificationService.error('Error 404');
                break;
            case 422: //Unprocessable entity.
                console.log(error);
                this.notificationService.error(error.error.errors.message);
                break;
            case 401: // Unauthorized.
                this.notificationService.error('No autorizado.');
                this.authService.logout();
                break;
            case 403: // Forbidden.
                this.notificationService.error('Acceso restringido.');
                this.authService.logout();
                break;
            default:
                this.notificationService.error('Default error');
                return "default error";
        }
    }
}