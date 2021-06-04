import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.scss']
})
export class UserListItemComponent implements OnInit {
  @Input() user:User;

  constructor(private userService:UserService, private router:Router) { }

  ngOnInit() {
  }

   //set dynamic classes
   setClasses(){
    let classes = {
      user: true,
      'is-approved': this.user.approved
    }
    return classes;
  }

  onToggle(user){
    console.log('toggle');
    //this is not needed anymore because i'm using [(ngModel)]="user.approved"
    //user.approved = !user.approved;
    this.userService.editUser(user).subscribe(user => {
      console.log(user);
    });
  }

  goToUserDetail(user){
    //TODO: move this event to the upper div.
    console.log('show user'); 
    this.router.navigate(['users', user.id]);
  }

  /*onDelete(user){
    console.log('delete');
    //here we need to emit upwards because we need to remove it from the list.
    this.deleteUser.emit(user);
  }*/

}
