import { Component, OnInit } from '@angular/core';
import {RequestService} from '../../services/request.service';
import {DatePipe} from '@angular/common';
import {AlltransacPage} from '../alltransac/alltransac.page';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.page.html',
  styleUrls: ['./commission.page.scss'],
})
export class CommissionPage implements OnInit {

  dataTypeDepot: any;
  dataTypeRetrait: any;
  stores: any;
  loadDepot: any;
  loadRetrait: any;
  montant = 0;
  owner: any;
  recus: any;
  recuss: any;
  idUser: number;
  page = 1;
  isDesc = true;
  typo: any;
  isAsc = false;
  depot = [{type: 'dépot'}];
  retrait = [{type: 'retrait'}];
  constructor(private req: RequestService, public datepipe: DatePipe) { }

  ngOnInit() {
    this.getTranc();
    this.theMontant();
  }
  getTranc() {
    this.req.getTD(4, this.page).subscribe(
      resp => {
        this.dataTypeDepot = resp;
        this.myBoucle(this.dataTypeDepot, this.depot, 1);
        this.req.getTR(4, this.page).subscribe(
          response => {
            this.dataTypeRetrait = response;
            this.myBoucle(this.dataTypeRetrait, this.retrait, 2);
            this.stores = this.dataTypeDepot.concat(this.dataTypeRetrait);
            this.stores = this.stores.sort((a, b) => +new Date(b.date)  - +new Date(a.date));
            console.log(this.stores);
          });
      });
  }
  myBoucle(arrays: any, type: any, dateName: number) {
    switch (dateName) {
      case 1:
        for (let i of arrays) {
          [].push.apply(i, type);
          i.date = this.datepipe.transform(i[`depotAt`], 'yyyy-MM-dd');
          i.user = i.userDepot;
          i.comm = i.fraisDepot;
        }
        break;
      case 2:
        for (let i of arrays) {
          [].push.apply(i, type);
          i.date = this.datepipe.transform(i[`retraitAt`], 'yyyy-MM-dd');
          i.user = i.userRetrait;
          i.comm = i.fraisRetrait;
        }
        break;
    }
  }

  returnHome() {

  }
  theMontant() {
    this.req.getTotalComD(4).subscribe(
      res => {
        this.recus = res;
        this.boucleMont(this.recus, 1);
      }
    );
    this.req.getTotalComR(4).subscribe(
      res => {
        this.recuss = res;
        this.boucleMont(this.recuss, 2);
      }
    );
  }
  boucleMont(arrays: any, num: number){
    switch (num) {
      case 1:
        for (let i of arrays) {
          this.montant += i.fraisDepot;
        }
        break;
      case 2:
        for (let i of arrays) {
          this.montant += i.fraisRetrait;
        }
        break;
    }
  }

  loadData(infiniteScroll) {
    this.page++;
    this.req.getTD(4, this.page).subscribe(
      res => {
        this.loadDepot = res;
        this.myBoucle(this.loadDepot, this.depot, 1);
        this.req.getTR(4, this.page).subscribe(
          response => {
            this.loadRetrait = response;
            this.myBoucle(this.loadRetrait, this.depot, 2);
            this.stores = this.stores.concat(this.loadDepot, this.loadRetrait);
            this.stores = this.stores.sort((a, b) => +new Date(b.date)  - +new Date(a.date));
            if (infiniteScroll) {
              infiniteScroll.target.complete();
            }
          });
      });
  }
}
