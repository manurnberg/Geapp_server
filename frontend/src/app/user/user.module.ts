import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserListItemComponent } from './components/user-list-item/user-list-item.component';
import { UserListFilterComponent } from './components/user-list-filter/user-list-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';
import { UserService } from './services/user.service';
import { HttpErrorInterceptor } from '../common/http-error.interceptor';




@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
    UserListItemComponent,
    UserListFilterComponent,
   ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    UserRoutingModule
  ],
  providers: [UserService,  {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true}],
  entryComponents: [UserDetailComponent]
})
export class UserModule { }
