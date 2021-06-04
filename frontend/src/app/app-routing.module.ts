import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { TermsAndConditionsComponent } from './components/pages/terms-and-conditions/terms-and-conditions.component';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';

const routes: Routes = [
  //{path: '', redirectTo: '/auth/login', pathMatch: 'full'},
  {path: '', redirectTo: '/users', pathMatch: 'full'},
  {path:'auth', loadChildren: './auth/auth.module#AuthModule'},
  {path:'users', loadChildren: './user/user.module#UserModule'},
  {path: 'tyc', component: TermsAndConditionsComponent},
  {path: 'employees', loadChildren: './employee/employee.module#EmployeeModule'},
  {path: '**', component: PageNotFoundComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
