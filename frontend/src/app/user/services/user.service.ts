import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../../models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from "../../../environments/environment";
import { filter } from 'rxjs/operators';
import { List } from 'src/app/models/list';
import { AuthService } from 'src/app/auth/services/auth.service';
import { VotingTable } from 'src/app/models/voting-table';

/*const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwibmF0aW9uYWxJZCI6IjU1NSIsInJvbGUiOiJBRE1JTiIsImlzT3duZXIiOnRydWUsImV4cCI6MTU3NzE1MTY0MywiaWF0IjoxNTcxOTY3NjQzfQ.wcYS6Bu2BAPSrhbJqog0GPvRGx1ZBAEAyGviz62FpNk'
  })
};*/

@Injectable({
  providedIn: 'root'
})
export class UserService {
  USERS_API_URL: string = environment.baseUrl+'/api/user';
  // private dataSource = new BehaviorSubject<any>({});

  // dataSource$ = this.dataSource.asObservable();


  constructor(private http: HttpClient, private authService: AuthService) { }

  //TODO: this form might be on the component and the data must be sent through the dialog.
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nationalId: new FormControl({value:'', disabled:true}, Validators.required),
    first: new FormControl({value:'', disabled:true}, Validators. required),
    last: new FormControl({value:'', disabled:true}),
    password: new FormControl(''),
    email: new FormControl({value:'', disabled:true}),
    phone: new FormControl({value:'', disabled:true}),
    helpPhone: new FormControl({value:'', disabled:true}),
    role: new FormControl({value:'', disabled:true}),
    createdAt: new FormControl({value:'', disabled:true}),
    approved: new FormControl(false),
    fiscal: new FormControl(false),
    table: new FormControl({value: '', disabled:true})
  });

  initFormGroup() {
    this.form.setValue({
      id: null,
      nationalId: '',
      first: '',
      last: '',
      password: '',
      email: '',
      phone: '',
      helpPhone: '',
      role: '',
      fiscal: false,
      table: '',
      createdAt: '',
      approved: false
    });
  }

  // sendData(data){

  //   this.dataSource.next(data)


  // }

  populateForm(user){
    //console.log(user);
    user.password='';
    user.email='';
    this.form.setValue(user);
   }

  //returns an observable
  getUsers(filterText: string, pageIx: number): Observable<List> {
    let params = new HttpParams();
    params = (filterText === '')? params : params.append('q', filterText);
    params = (String(pageIx) === '')? params : params.append('page', String(pageIx));
    return this.http.get<List>(`${this.USERS_API_URL}`, {params: params, headers: this.getHttpAuthHeader()});
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.USERS_API_URL}/${id}`, {headers:this.getHttpAuthHeader()});
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.USERS_API_URL, user, {headers:this.getHttpAuthHeader()});
  }

  editUser(user: User): Observable<any> {
    if (user.password !== undefined && user.password.trim() == '') {
      user.password = undefined;
    }
    //console.log(`onSubmit after ${user.password}`);
    const url = `${this.USERS_API_URL}/${user.id}`;
    return this.http.put(url, user, {headers:this.getHttpAuthHeader()});
  }

  private getHttpAuthHeader():HttpHeaders{
    return this.authService.getHttpHeader(true);
  }

  /*deleteUser(user: User): Observable<User> {
    const url = `${this.usersUrl}/${user.id}`;
    return this.http.delete<User>(url, httpOptions);
  }*/


}
