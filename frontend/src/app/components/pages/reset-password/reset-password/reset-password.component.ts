import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { HeaderComponent } from 'src/app/components/layout/header/header.component';
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
    public resetPasswordService: ResetPasswordService,
    private router: Router) { }



  myValidator(form: FormGroup) {
    return true;
  }

  async ngOnInit() {
    localStorage.removeItem('TOKEN');
   
  }
    toogleEye() {
    this.hide = !this.hide;
  }

  async onSubmit() {
   // console.log("reset password ngOnInit");
    this.jwtHelper = new JwtHelperService();
    //this.loginForm = this.fb.group({ password: '', rePassword: '' }, { validator: this.myValidator })
    const token = await this.activateRoute.snapshot.params.token;
    localStorage.setItem('TOKEN', token);
    this.jwttoken = this.jwtHelper.decodeToken(token);

    this.resetPasswordService.getUser(this.jwttoken['id']).subscribe(data => {
     // console.log(" user data ", data);
      this.resetPasswordService.updateUserPassword(data).subscribe(data => {
       // console.log("update user data ", data);
       // this.notificationService.info("ya puedes usar tu nueva contraseña");
        localStorage.removeItem('TOKEN');
        this.router.navigate(['/reset-confirm']);
        
        

      }, error => {
        console.log("error update pass ", error);
        this.notificationService.error(error.error.message);
      });

    }, error => {
      console.log("error get user data ", error);
      this.notificationService.error(error.error.message);
    });
  }

}
