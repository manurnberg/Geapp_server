import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-list-filter',
  templateUrl: './user-list-filter.component.html',
  styleUrls: ['./user-list-filter.component.scss']
})
export class UserListFilterComponent implements OnInit {
  
  @Output() filterUsers:EventEmitter<any> = new EventEmitter();
  filterText:string = '';

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    this.filterText = this.filterText.trim();
    this.filterUsers.emit(this.filterText);
  }

}
