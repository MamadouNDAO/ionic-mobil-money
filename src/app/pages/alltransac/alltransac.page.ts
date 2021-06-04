import { Component, OnInit } from '@angular/core';
import {RequestService} from '../../services/request.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-alltransac',
  templateUrl: './alltransac.page.html',
  styleUrls: ['./alltransac.page.scss'],
})
export class AlltransacPage implements OnInit {

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

  returnHome() {

  }

  onTri() {

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
  theMontant() {
    this.req.getTotalMontD(4).subscribe(
      res => {
        this.recus = res;
        this.boucleMont(this.recus);
      }
    );
    this.req.getTotalMontR(4).subscribe(
      res => {
        this.recuss = res;
        this.boucleMont(this.recuss);
      }
    );
  }
  boucleMont(arrays: any){
    for (let i of arrays) {
      this.montant += i.montant;
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
