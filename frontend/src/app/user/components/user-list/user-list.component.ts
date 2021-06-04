import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from '../../services/user.service';
import { MatTableDataSource, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { PageEvent, MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  searchKey: string;
  displayedColumns: string[] = ['nationalId', 'first', 'last', 'phone', 'actions'];
  listData: MatTableDataSource<User>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  constructor(private userService: UserService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.paginator.pageSize = 25;
    this.paginator._intl.itemsPerPageLabel = 'Usuarios por página';
    this.onSearchClear();
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
      this.paginator.length = userList.count;
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
    const matRef = this.dialog.open(UserDetailComponent, dialogConfig);
    /*matRef.afterClosed().subscribe(
      () => console.log('sa')
    );*/
    
  }



}
