import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { AuthGuardService } from '../auth/services/auth-guard.service';

const routes: Routes = [
  {path: '', component: UserListComponent, canActivate: [AuthGuardService], data:{expectedRole: 'ADMIN'}},
  //{path: ':id', component: UserDetailComponent, canActivate: [AuthGuardService], data:{expectedRole: 'ADMIN'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
