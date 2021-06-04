import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../employee.service';
import { MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  constructor(public service:EmployeeService,
    private dialogRef:  MatDialogRef<EmployeeComponent>) { }

  departments = [
    {id:1, value:'Dept 1'},
    {id:2, value:'Dept 2'},
    {id:3, value:'Dept 3'},
  ];

  ngOnInit() {
  }

  onClear(){
    this.service.form.reset();
    this.service.intializeFormGroup();
    this.onClose();
  }

  onSubmit(){
     this.onClose();
  }


  onClose(){
    this.service.form.reset();
    this.service.intializeFormGroup();
    this.dialogRef.close();
  }


}
