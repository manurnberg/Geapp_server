import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from '../../services/user.service';
import { MatTableDataSource, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { MatIconModule } from '@angular/material';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  searchKey: string;
  displayedColumns: string[] = ['nationalId', 'first', 'last', 'phone','table','fiscal', 'actions'];
  listData: MatTableDataSource<any>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  userTable : any;


  constructor(private userService: UserService,
    private dialog: MatDialog,
    private notificationService: NotificationService) { }

  ngOnInit() {

    this.paginator.pageSize = 25;
    this.paginator._intl.itemsPerPageLabel = 'Usuarios por página';
    this.onSearchClear();

    // this.userService.dataSource$.subscribe(results => {
    //   this.userTable = results

    //   console.log("results of usertable", this.userTable['nationaId'])



    //   console.log("results of vtable", results)

    // })
  }

  onPaginatorChange() {
    this.applyFilter();
  }

  onSearchClear() {
    this.searchKey = '';
    this.onSearch();
  }

  onSearch() {
    //restart pagination.
    this.paginator.pageIndex = 0;
    this.applyFilter();
  }

  applyFilter() {
    const textFilter = this.searchKey.trim().toLowerCase();
    const pageIx = this.paginator.pageIndex;

    //console.log(`Filter: ${textFilter} and PageIx: ${this.paginator.pageIndex} and PageSize:${this.paginator.pageSize} `);
    this.userService.getUsers(textFilter, pageIx).subscribe(userList => {

      console.log("userlist type--->>>", userList)
      // userList.rows.forEach(element => {
      //   console.log("iterating List", element.nationalId)
      //   if(element.nationalId == this.userTable['nationaId']){
      //     if(!element.table){

      //     console.log("element inside array", element);
      //     element['table'] = this.userTable['table'];

      //     console.log('ELEMENT AFTER CHANGE-->', element);

      //     console.log("trueeeeee");
      //     }


      //   }

      // });
      this.paginator.length = userList.count;
      console.log("users ----->>>>>", userList)
      this.listData = new MatTableDataSource(userList.rows);
    });
  }

  onEdit(row) {
    this.userService.populateForm(row);
    this.openDialog();
  }

  private openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.height = '60%';
    const matRef = this.dialog.open(UserDetailComponent, dialogConfig);
    matRef.afterClosed().subscribe(

      () =>{console.log("onclose event launched");

        this.ngOnInit()
      }
    );

  }



}
