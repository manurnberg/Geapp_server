import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { TermsAndConditionsComponent } from './components/pages/terms-and-conditions/terms-and-conditions.component';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { ResetPasswordComponent } from './components/pages/reset-password/reset-password/reset-password.component';
import { ResetPassConfirmComponent } from './components/pages/reset-pass-confirm/reset-pass-confirm.component';

const routes: Routes = [
  //{path: '', redirectTo: '/auth/login', pathMatch: 'full'},
  {path: '', redirectTo: '/users', pathMatch: 'full'},
  {path:'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path:'users', loadChildren: () => import('./user/user.module').then(m => m.UserModule)},
  {path: 'tyc', component: TermsAndConditionsComponent},
  {path: 'employees', loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule)},
  {path: 'reset/:token', component: ResetPasswordComponent},
  {path: 'reset-confirm', component: ResetPassConfirmComponent},
  {path: '**', component: PageNotFoundComponent},
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
