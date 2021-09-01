import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user';
import { MatDialogRef } from "@angular/material";
import { NotificationService } from 'src/app/services/notification.service';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user:User;
  hide = true;
  userTable: any;

  constructor(private route:ActivatedRoute,
    private router:Router,
    public userService:UserService,
    private notificationService: NotificationService
   // private location:Location,
   , private dialogRef:  MatDialogRef<UserDetailComponent>,



    ) { }

  ngOnInit() {
    console.log("current user", this.userService.form.controls['id'].value)
  }

  onSubmit(){
    //TODO: No se está refrescando los elementos en la lista cuando se edita un usuario.
    this.userService.editUser(this.userService.form.value).subscribe(
      msg => {
        console.log("inside msg payload-->>", msg)
        this.notificationService.info(msg.status);
        // this.userTable = { 'table':msg.table,
        // 'nationaId':msg.nationalId

        // };
        // this.userService.sendData(this.userTable);
        // console.log("usertable ---->> ", this.userTable);
        // if(sessionStorage.getItem('table') != ''){
        //   sessionStorage.setItem('table', '');
        // }
        // sessionStorage.setItem('table',this.userTable);

        this.onClose();


      }
    );

    // const id = +this.route.snapshot.paramMap.get('id');
    // this.userService.getUser(id).subscribe(user => {this.user = user
    // console.log("user---->>> ", this.user)});


  }

  onClear(){
    this.userService.form.reset();
    this.userService.initFormGroup();
  }

  onClose(){
    this.onClear();
    this.dialogRef.close();

  }

}
