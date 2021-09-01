import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  refreshList : Subject<any>;

  constructor(public snackBar: MatSnackBar) { }

  config:MatSnackBarConfig = {duration: 3000, horizontalPosition: 'center', verticalPosition:'top'};

  error(msg){
     //this.config['panelClass'] = ['notification','error']
     this.snackBar.open(msg, '', this.config);
  }

  info(msg){
    this.snackBar.open(msg, '', this.config);
  }

  sendClickEvent(){
    this.refreshList.next()
  }

  getClickEvent(): Observable<any> {
    return this.refreshList.asObservable()
  }

}
