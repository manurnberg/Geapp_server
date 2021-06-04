import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { NotificationService } from 'src/app/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private auth:AuthService, 
    private notificationService: NotificationService,
    private router:Router) { }

  canActivate(route: ActivatedRouteSnapshot) : boolean {
    // this will be passed from the route config on the data property
    //console.log('AUTH GUARD-CanActivateW/Role: isAuthcated?:'+this.auth.isAuthenticated() + " / Role:"+tokenPayload.role + " expected:"+expectedRole ); 
    
    if (!this.auth.isAuthenticated()){
      this.router.navigate(['/auth/login']);
      return false;
    }
    
    const expectedRole = route.data.expectedRole;
    if (this.auth.decode().role !== expectedRole ) {
      this.notificationService.error('No tiene rol para ver esta página.');
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }

}
