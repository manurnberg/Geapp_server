import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../../models/user';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { format } from 'url';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router:Router, private fb: FormBuilder) { }
  
  loginForm:FormGroup;
  
  myValidator(form:FormGroup){
    return true;
  }

  ngOnInit() {
    // this.loginForm = new FormGroup({
    //   nationalId: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(4)])
    // }, {validator: this.myValidator});
    this.loginForm = this.fb.group({nationalId:'', password:''}, {validator: this.myValidator})

    if(this.authService.isAuthenticated()){
      console.log('User logged. Redirecting to /');
      this.router.navigateByUrl('/');
    }
  }

  onSubmit(){
    //console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe(
      (user:User) => { this.router.navigateByUrl('/'); },
      error => {
        console.log('Not right privileges: ' + error)}
      );
  }

  onLogin(form):void{
    //console.log('Login', form.value);
    
  }

}
