import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeComponent } from './employees/employee/employee.component';
import { EmployeeListComponent } from './employees/employee-list/employee-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { EmployeeService } from './employee.service';


@NgModule({
  declarations: [EmployeesComponent, EmployeeComponent, EmployeeListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    EmployeeRoutingModule
  ],
  providers: [EmployeeService],
  entryComponents: [EmployeeComponent]
})
export class EmployeeModule { }
