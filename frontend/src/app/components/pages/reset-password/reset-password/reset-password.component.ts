import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/models/user';
import { NotificationService } from 'src/app/services/notification.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  
  constructor(private fb: FormBuilder, private resetPasswordService: ResetPasswordService, private notificationService: NotificationService) { }

  loginForm:FormGroup;
  user:User;

  myValidator(form:FormGroup){
    return true;
  }

  ngOnInit() {
    this.loginForm = this.fb.group({password:'', rePassword:''}, {validator: this.myValidator})

    // if(this.authService.isAuthenticated()){
    //   console.log('User logged. Redirecting to /');
    //   this.router.navigateByUrl('/');
    // }
  }

  onSubmit(){

    this.resetPasswordService.updateUserPassword(this.resetPasswordService.form.value).subscribe(
      msg => {
        console.log("inside msg payload-->>", msg)
        this.notificationService.info(msg.status);
      });
    //console.log(this.loginForm.value);
    console.log("contrsenia cambiada")
  }

}
