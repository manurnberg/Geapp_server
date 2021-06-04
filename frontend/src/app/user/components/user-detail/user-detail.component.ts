import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user';
import { MatDialogRef } from "@angular/material";
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user:User;
  hide = true;

  constructor(private route:ActivatedRoute,
    private router:Router,
    public userService:UserService,
    private notificationService: NotificationService
   // private location:Location,
   , private dialogRef:  MatDialogRef<UserDetailComponent>
    ) { }

  ngOnInit() {
    /*const id = +this.route.snapshot.paramMap.get('id');
    this.userService.getUser(id).subscribe(user => this.user = user);*/

  }

  onSubmit(){
    //TODO: No se está refrescando los elementos en la lista cuando se edita un usuario.
    this.userService.editUser(this.userService.form.value).subscribe(
      msg => {
        this.notificationService.info(msg.status);
        this.onClose();
      }
    );
    
  }

  onClear(){
    this.userService.form.reset();
    this.userService.initFormGroup();
  }

  onClose(){
    this.onClear();
    this.dialogRef.close(
      
    );
  }

}
