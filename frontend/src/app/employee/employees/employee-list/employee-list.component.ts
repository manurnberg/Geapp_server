import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../../employee.service';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { EmployeeComponent } from '../employee/employee.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styles: []
})
export class EmployeeListComponent implements OnInit {

  constructor(private service: EmployeeService, 
    private dialog: MatDialog) { }

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['fullName', 'email', 'mobile', 'city','actions'];
  //@ViewChild(MatSort) sort: MatSort;
  //@ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  ngOnInit() {
    const array = this.service.getList();
    this.listData = new MatTableDataSource(array);
    //this.listData.sort = this.sort;
    //this.listData.paginator = this.paginator;
    this.listData.filterPredicate = (data, filter) => {
      return this.displayedColumns.some(ele => {
        return ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
      });
    };
  }

  onCreate(){
    this.openDialog();
  }

  onEdit(row){
    this.service.populateForm(row);
    this.openDialog(); 
  }

  onDelete($key){
    if(confirm('Are you sure to delete this record?')){
      console.log(`Delete ${$key}`)
    }
  }

  private openDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(EmployeeComponent,dialogConfig);
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

}
