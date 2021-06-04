import { Component, OnInit } from '@angular/core';
import {TokenService} from '../../services/token.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(private service: TokenService, private router: Router) { }

  ngOnInit() {
  }

  deconnect() {
    this.service.removeToken('token');
    this.router.navigate(['/']);
  }

  navigeOn(host: string) {
    this.router.navigate(['/' + host]);
  }
}
