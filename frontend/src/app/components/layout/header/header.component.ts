import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../auth/services/auth.service";
import { AuthModule } from 'src/app/auth/auth.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private authService:AuthService) { }

  ngOnInit() {
  }

  isAuthenticated():boolean{
    return this.authService.isAuthenticated();
  }

  logout():void{
    this.authService.logout();
  }

}
