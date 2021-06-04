import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { Capability } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor() { }

  form: FormGroup = new FormGroup({
    $key:new FormControl(null),
    first:new FormControl('', [Validators.required, Validators.minLength(8)]),
    email:new FormControl('', Validators.email),
     
    approved:new FormControl(false),
    department:new FormControl('2'),
    gender: new FormControl('1'),
    hireDate: new FormControl(''), 
    isPermanent:new FormControl(false),
  });

 intializeFormGroup(){
   this.form.setValue({
     $key:null,
     first:'',
     email: '',
     gender: '1',
     department: '2',
     hireDate:'',
     isPermanent: false,
     approved: false
   });
 }

 populateForm(employee){
  this.form.setValue(employee);
 }

 getList(){
  return [
    {$key:'1', fullName:'Tomas1', email: 'something1@test.com', mobile:'54-911-4645', city: 'other'},
    {$key:'2', fullName:'Tomas2', email: 'something2@test.com', mobile:'54-911-4645', city: 'other'},
    {$key:'3', fullName:'Tomas3', email: 'something3@test.com', mobile:'54-911-4645', city: 'other'},
    {$key:'4', fullName:'Tomas4', email: 'something4@test.com', mobile:'54-911-4645', city: 'other'},
    {$key:'5', fullName:'Tomas5', email: 'something5@test.com', mobile:'54-911-4645', city: 'other'},
    {$key:'6', fullName:'Tomas6', email: 'something5@test.com', mobile:'54-911-4645', city: 'other'},
    {$key:'7', fullName:'Tomas7', email: 'something5@test.com', mobile:'54-911-4645', city: 'other'},
    {$key:'8', fullName:'Tomas8', email: 'something5@test.com', mobile:'54-911-4645', city: 'other'},
    {$key:'9', fullName:'Tomas9', email: 'something5@test.com', mobile:'54-911-4645', city: 'other'}
  ]
 }
}
