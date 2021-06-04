import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../models/user';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import { environment } from "../../../environments/environment";
import { NotificationService } from 'src/app/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  TOKEN_NAME:string = 'TOKEN';
  AUTH_API_URL: string = environment.baseUrl+'/api/user';
  authSubject = new BehaviorSubject(false);
  private token: string;
  private jwtHelper:JwtHelperService;

  constructor(private httpClient: HttpClient, private router:Router, private notificationService:NotificationService) { 
      //this is not injectable.
      this.jwtHelper = new JwtHelperService();
    }


  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_NAME);
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  login(user:User):Observable<User>{
    return this.httpClient.post<User>(`${this.AUTH_API_URL}/login`, user).pipe(tap(
      (res: User) => {
        if(res && res.role == 'ADMIN'){
          this.saveToken(res.token, res.token);
        }else{
          this.notificationService.error('Sólo acceso para administradores.');
          throw new Error('Not Admin');
        }
      }
    ));
  }

  private saveToken(token:string, expiresIn:string):void{
    localStorage.setItem(this.TOKEN_NAME, token);
    //localStorage.setItem('EXPIRES_IN', expiresIn);
    this.token = token;
  }

  logout():void{
    this.token = '';
    localStorage.removeItem(this.TOKEN_NAME);
    //localStorage.removeItem('EXPIRES_IN');
    //TODO: this router should be directly on the component. 
    //(due to it's not on the right place when the logout is called from the interceptor).
    this.router.navigateByUrl('/auth/login');
  }
  
  decode():User{
    const token = localStorage.getItem(this.TOKEN_NAME);
    return this.jwtHelper.decodeToken(token);
  }

  getHttpHeader(isAuth:boolean):HttpHeaders{
    const token = this.getToken();
    if(isAuth && token){
      return new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ token });
    }  
    return new HttpHeaders({'Content-Type': 'application/json'});
  }

  private getToken():string {
    if(!this.token){
      this.token = localStorage.getItem(this.TOKEN_NAME);
    }
    return this.token;
  }


  /* NOT IN USE */
  /*register(user:User):Observable<JwtResponse>{
    return this.httpClient.post<JwtResponse>(`${this.AUTH_SERVER}/register`, user).pipe(tap(
      (res: JwtResponse) => { if(res){ this.saveToken(res.dataUser.accessToken, res.dataUser.expiresIn); } }
    ));
  }*/


}
