import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TokenService} from '../../services/token.service';
import {Owners, RequestService} from '../../services/request.service';
import {Observable} from 'rxjs';
import {share} from 'rxjs/operators';

export interface Agences {
  id: number;
  compte: any;
}
export interface Comptes {
  id: number;
  solde: number;
}
export interface Datas {
  id: number;
  agence: any;
}

class Todo {
}

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  private mail: any;
  token: any;
  solde = 0;
  idUser: number;
  idAgence: number;
  idCompte: number;
  compte: any;
  agence: any;
  datas: any;
  role: string;
  isAdmin = false;
  constructor(private router: Router, private service: TokenService, private req: RequestService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log('test');
    this.route.queryParams.subscribe(
      params => {
        this.role = params.role;
        // this.solde = params.solde;
        // this.token = params.token;
        if (this.role == 'ROLE_ADMIN_AGENCE') {
          this.isAdmin = true;
        }
      }
    );
    this.token = this.req.rtnToken();
    this.req.getOwnerUser(this.token);
    this.req.shares.subscribe(
      data => {
        this.datas = data;
        this.idUser = this.datas[`id`];
        this.agence = this.datas[`agence`];
        this.idAgence = this.agence?.id;
        this.compte = this.agence?.compte;
        this.solde = this.compte?.solde;
        this.idCompte = this.compte?.id;
      }
    );
  }

  returnHome() {
    this.router.navigate(['/menu']);
  }

  deconnect() {
      this.service.removeToken('token');
      this.router.navigate(['/']);
  }
  navigTo(name: string) {
    this.router.navigate(['/' + name],
      { queryParams: {iduser: this.idUser, idComp: this.idCompte, idAgence: this.idAgence, solde: this.solde}});
  }
  ionViewWillEnter() {
    this.ngOnInit();
  }
}
