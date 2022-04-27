import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from "../../environments/environment";
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class ResetPasswordService {
    RESET_API_URL: string = environment.baseUrl + '/api/user/';
    // private dataSource = new BehaviorSubject<any>({});

    // dataSource$ = this.dataSource.asObservable();


    constructor(private http: HttpClient, private authService: AuthService) { }

    //TODO: this form might be on the component and the data must be sent through the dialog.
    form: FormGroup = new FormGroup({
        password: new FormControl(''),
        rePassword: new FormControl('')

    });

    initFormGroup() {
        this.form.setValue({
            password: '',
            rePassword: ''

        });
    }

    

    populateForm(user) {
       
        user.password = '';
        
        this.form.setValue(user);
    }


    getUser(id: number): Observable<User> {
        return this.http.get<User>(`${this.RESET_API_URL}/${id}`, { headers: this.getHttpAuthHeader() });
    }


    updateUserPassword(user: User): Observable<any> {
        if (user.password !== undefined && user.password.trim() == '' && this.form.get('rePassword').value !== undefined && this.form.get('rePassword').value.trim() == '' && this.form.get('rePassword').value !== user.password ) {
            user.password = undefined;
        }
        const url = `${this.RESET_API_URL}/${user.id}`;
        return this.http.put(url, user, { headers: this.getHttpAuthHeader() });
    }

    private getHttpAuthHeader(): HttpHeaders {
        return this.authService.getHttpHeader(true);
    }

    /*deleteUser(user: User): Observable<User> {
      const url = `${this.usersUrl}/${user.id}`;
      return this.http.delete<User>(url, httpOptions);
    }*/


}
