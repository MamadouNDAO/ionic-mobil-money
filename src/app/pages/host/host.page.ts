import { Component, OnInit } from '@angular/core';
import {IonTabs} from '@ionic/angular';
import {Router} from '@angular/router';
import {LoginPage} from '../login/login.page';
import {RequestService} from '../../services/request.service';
import {TokenService} from '../../services/token.service';

@Component({
  selector: 'app-host',
  templateUrl: './host.page.html',
  styleUrls: ['./host.page.scss'],
})
export class HostPage implements OnInit {

  isAdmin = false;
  role: string;
  constructor(public router: Router, private page: LoginPage, private req: RequestService, private store: TokenService) { }

  ngOnInit() {
    const token = this.req.rtnToken();
    this.role = this.store.getRole(token);
    console.log(this.role);
    if (this.role == 'ROLE_ADMIN_AGENCE') {
      this.isAdmin = true;
    }
  }
 /*gets(tab: any) {
    if ('/host/' + tab.getSelected() != this.router.url) {
      this.router.navigateByUrl(this.router.url);
     // this.router.navigateByUrl('host/' + tab.getSelected());
      console.log('host/' + tab.getSelected());
      // window.location.reload();
    }
  }*/

}
