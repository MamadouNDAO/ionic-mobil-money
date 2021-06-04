import { Component, OnInit } from '@angular/core';
import {RequestService} from '../../services/request.service';
import {DatePipe} from '@angular/common';
import {sortTasksByPriority} from '@angular/compiler-cli/ngcc/src/execution/tasks/utils';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage implements OnInit {

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
  isAsc = false;
  private type: { type: string }[];
  datas = [{type: 'dépot'}];
  retrait = [{type: 'retrait'}];
  constructor(private req: RequestService, public datepipe: DatePipe) { }

  async ngOnInit() {
    console.log('okk');
    this.myOwner();
    this.getTypeDepot();
    this.theMontant();
    // console.log(this.stores);
  }
  getTypeDepot() {
    this.req.typeDepot(this.idUser, this.page).subscribe(
      res => {
        this.dataTypeDepot = res;
        for (let i of this.dataTypeDepot) {
          [].push.apply(i, this.datas);
          i.depotAt = this.datepipe.transform(i[`depotAt`], 'yyyy-MM-dd');
          i.date = i.depotAt;
          // this.montant += i.montant;
        }
      }
    );
    this.req.typeRetrait(this.idUser, this.page).subscribe(
      response => {
        this.dataTypeRetrait = response;
        for (let i of this.dataTypeRetrait) {
          [].push.apply(i, this.retrait);
          i.retraitAt = this.datepipe.transform(i[`retraitAt`], 'yyyy-MM-dd');
          i.date = i.retraitAt;
        }
        this.dataTypeDepot = this.dataTypeDepot.concat(this.dataTypeRetrait);
        this.stores = this.dataTypeDepot.sort((a, b) => +new Date(b.date)  - +new Date(a.date));
      }
    );
  }

  returnHome() {

  }

  loadData(infiniteScroll) {
    this.page++;
    this.req.typeDepot(this.idUser, this.page).subscribe(
      res => {
        this.loadDepot = res;
        for (let i of this.loadDepot) {
          [].push.apply(i, this.datas);
          i.depotAt = this.datepipe.transform(i[`depotAt`], 'yyyy-MM-dd');
          i.date = i.depotAt;
        }
      }
    );
    this.req.typeRetrait(this.idUser, this.page).subscribe(
      response => {
        this.loadRetrait = response;
        for (let i of this.loadRetrait) {
          [].push.apply(i, this.retrait);
          i.depotAt = this.datepipe.transform(i[`depotAt`], 'yyyy-MM-dd');
          i.date = i.depotAt;
        }
        this.loadDepot = this.loadDepot.concat(this.loadRetrait);
        // this.loadDepot = this.loadDepot.sort((a, b) => +new Date(b.date)  - +new Date(a.date));
        this.stores = this.stores.concat(this.loadDepot);
        this.stores = this.stores.sort((a, b) => +new Date(b.date)  - +new Date(a.date));
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
      }
    );
  }
  myOwner() {
    this.req.content.subscribe(
      data => {
        this.owner = data;
        this.idUser = this.owner[`id`];
      }
    );
  }
  theMontant() {
    this.req.getTotalMD(this.idUser).subscribe(
      res => {
        this.recus = res;
        for (let i of this.recus) {
          this.montant += i.montant;
        }
      }
    );
    this.req.getTotalMR(this.idUser).subscribe(
      res => {
        this.recuss = res;
        for (let i of this.recuss) {
          this.montant += i.montant;
        }
      }
    );
  }

  onTri() {
    this.isDesc = !this.isDesc;
    this.isAsc = !this.isAsc;
    if (this.isDesc) {
      this.stores = this.stores.sort((a, b) => +new Date(b.date)  - +new Date(a.date));
    }
    if (this.isAsc) {
      this.stores = this.stores.sort((a, b) => +new Date(a.date)  - +new Date(b.date));
    }
  }
}
