import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {TokenService} from './token.service';
import {FormControl, FormGroup} from '@angular/forms';

export interface Owners {
  id: number;
  agence: any;
}

class Todo {
  id: number;
  agence: any;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  clef: string;
  apiHost: string = environment.apiHost;
  id: number;
  solde: number;
  agence: any;
  compte: any;
  public owner: any[] = [];
  // @ts-ignore
  public content = new BehaviorSubject<any>([this.owner]);
  public dataStore: { share: Todo[] } = { share: [] };
  readonly share = this.content.asObservable();
  montForm: FormGroup;
  private token: any;
  private mail: any;

  constructor(private http: HttpClient, private service: TokenService) {
  }

  get shares() {
    return this.content.asObservable();
  }

  svToken(token: string) {
    this.token = token;
  }
  rtnToken() {
    return this.token;
  }
  getOwnerUser(token: string) {
    this.mail = this.service.getMail(token);
    this.http.get(this.apiHost + 'admin/owner/' + this.mail).subscribe(
      data => {
        // @ts-ignore
        this.dataStore.share = data;
        this.getLatestData(data);
        // this.content.next(Object.assign({}, this.dataStore).share);
      }
    );
  }
  getLatestData(data) {
    this.content.next(data);
    this.owner = data;
  }
  doRefresh() {
    this.content.next(true);
  }




  getFrais(data: number): Observable<any>{
    this.montForm = new FormGroup({
      montant: new FormControl('')
    });
    this.montForm.setValue({
      montant: data
    });
    const val = this.montForm.value;
    return this.http.post(this.apiHost + 'transactions/calculateur', val);
  }
  depot(idUser: number, idCompte: number, montant: number) {
    return this.http.post(this.apiHost + 'agence/' + idCompte + '/agent/' + idUser + '/depot', montant);
  }
  getTransac(idComp: number, idUser: number, code: string): Observable<any> {
    return this.http.get(this.apiHost + 'agences/' + idComp + '/agent/' + idUser + '/transactions/' + code);
  }
  retrait(idComp: number, idUser: number, code: string, data: any): Observable<any> {
    return this.http.put(this.apiHost + 'agence/' + idComp + '/agent/' + idUser + '/retrait/' + code, data);
  }
  typeDepot(idUser: number, page: number) {
    return this.http.get(this.apiHost + 'transactions?userDepot.id=' + idUser + '&page=' + page);
  }
  typeRetrait(idUser: number, page: number) {
    return this.http.get(this.apiHost + 'transactions?userRetrait.id=' + idUser + '&page=' + page);
  }
  getTotalMD(idUser: number) {
    return this.http.get(this.apiHost + 'totals?userDepot.id=' + idUser + '&pagination=false');
  }
  getTotalMR(idUser: number) {
    return this.http.get(this.apiHost + 'totals?userRetrait.id=' + idUser + '&pagination=false');
  }
  getTD(idCompte: number, page: number) {
    return this.http.get(this.apiHost + 'transactions?compte.id=' + idCompte + '&page=' + page);
  }
  getTR(idCompte: number, page: number) {
    return this.http.get(this.apiHost + 'transactions?compteRetrait.id=' + idCompte + '&page=' + page);
  }
  getTotalMontD(idCompte: number) {
    return this.http.get(this.apiHost + 'totals?compte.id=' + idCompte + '&pagination=false');
  }
  getTotalMontR(idCompte: number) {
    return this.http.get(this.apiHost + 'totals?compteRetrait.id=' + idCompte + '&pagination=false');
  }
  getTotalComD(idCompte: number) {
    return this.http.get(this.apiHost + 'comtotals?compte.id=' + idCompte + '&pagination=false');
  }
  getTotalComR(idCompte: number) {
    return this.http.get(this.apiHost + 'comtotals?compteRetrait.id=' + idCompte + '&pagination=false');
  }
}
