import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
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
  jwtHelper: JwtHelperService;
  loginForm: FormGroup;
  user: User;
  jwttoken: {};
  hide : boolean = true;

  constructor(private fb: FormBuilder,
    private notificationService: NotificationService,
    private activateRoute: ActivatedRoute,
    public resetPasswordService: ResetPasswordService) { }



  myValidator(form: FormGroup) {
    return true;
  }

  async ngOnInit() {
    this.jwtHelper = new JwtHelperService();
    //this.loginForm = this.fb.group({ password: '', rePassword: '' }, { validator: this.myValidator })
    const token = await this.activateRoute.snapshot.params.token;
    localStorage.setItem('TOKEN', token);
    this.jwttoken = this.jwtHelper.decodeToken(token);
   
  }
    toogleEye() {
    this.hide = !this.hide;
  }

  async onSubmit() {
    this.resetPasswordService.getUser(this.jwttoken['id']).subscribe(data => {
      console.log("data ", data);
      this.resetPasswordService.updateUserPassword(data).subscribe(data => {
        console.log("data ", data);
        this.notificationService.info("ya puedes usar tu nueva contraseña");

      }, error => {
        console.log("error ", error);
        this.notificationService.error(error.error.message);
      });

    });

  }

}
