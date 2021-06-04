import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageService} from '../../services/message.service';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestService} from '../../services/request.service';
import {DatePipe} from '@angular/common';
import {AlertController, IonInput, LoadingController} from '@ionic/angular';

export interface Transac {
  id: number;
  montant: number;
  clientDepot: any;
  clientRetrait: any;
  depotAt: any;
  code: string;
}
export interface ClRt {
  id: number;
  nom: string;
  telephone: number;
  cnid: string;
}
@Component({
  selector: 'app-retrait',
  templateUrl: './retrait.page.html',
  styleUrls: ['./retrait.page.scss'],
})
export class RetraitPage implements OnInit {
  segment = 0;
  isBenef = true;
  isEmetor = false;
  codeForm: FormGroup;
  cniForm: FormGroup;
  idUser: number;
  idAgence: number;
  idCompte: number;
  transacs: Transac[] = [];
  trans: any;
  clientR: ClRt[] = [];
  clientD: ClRt[] = [];
  nomR: string;
  nomD: string;
  teleR: number;
  teleD: number;
  cniD: string;
  isOki = false;
  montant: number;
  noRetire = false;
  solde: number;
  commission: number;
  code: string;
  date: string;
  errorMessages = {
    cni: undefined,
    code: undefined,
  };
  private loading: HTMLIonLoadingElement;
  constructor(
    private msg: MessageService,
    private route: ActivatedRoute,
    private req: RequestService,
    private router: Router,
    public datepipe: DatePipe,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    ) {this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.idUser = params.iduser;
        this.idAgence = params.idAgence;
        this.idCompte = params.idComp;
        this.solde = params.solde;
      });
    this.initFormCode();
    this.initCniForm();
    this.errorMessages = this.msg.errorMessage;
  }
  get sode() {
    return this.codeForm.get('code');
  }
  get cni() {
    return this.cniForm.get('cnid');
  }
  initFormCode() {
    this.codeForm = new FormGroup({
      code: new FormControl('', [Validators.required,
        Validators.pattern('[0-9\\-]+$'), Validators.minLength(11), Validators.maxLength(11)])
    });
  }
  initCniForm() {
    this.cniForm = new FormGroup({
      cnid: new FormControl('', [Validators.required,
        Validators.pattern('^[0-9\\s]*$'), Validators.minLength(16), Validators.maxLength(16)])
    });
  }
  segmentChanged($event: any) {
    this.isBenef = !this.isBenef;
    this.isEmetor = !this.isEmetor;
  }

  test(code: any) {
    if (code.value.length == 3 || code.value.length == 7 ){
      code.value = code.value + '-';
    }
    if (code.value.length == 11)
    {
      this.loadingAnim();
      this.code = code.value;
      this.req.getTransac(this.idCompte, this.idUser, code.value).subscribe(
        response => {
          this.transacs = response;
          this.clientR = this.transacs[`clientRetrait`];
          this.clientD = this.transacs[`clientDepot`];
          this.nomR = this.clientR[`nom`];
          this.nomD = this.clientD[`nom`];
          this.teleR = this.clientR[`telephone`];
          this.teleD = this.clientD[`telephone`];
          this.cniD = this.clientD[`cnid`];
          this.montant = this.transacs[`montant`];
          this.date = this.datepipe.transform(this.transacs[`depotAt`], 'yyyy-MM-dd');
          this.loading.dismiss();
          this.isOki = true;
        },
        async error => {
          await this.loading.dismiss();
          const alert = await this.alertCtrl.create({
            cssClass: 'alert',
            header: 'Confirmation',
            message: 'Transaction déjà retirée.',
            buttons: ['ok']
          });
          await alert.present();
          this.initFormCode();
          this.noRetire = true;
        }
      );
    }
  }

  returnHome() {
    this.router.navigate(['/host/principal']);
  }

  checkCni(cnis: any) {
    if (cnis.value.length == 1 || cnis.value.length == 5 || cnis.value.length == 10 ) {
      cnis.value = cnis.value + ' ';
    }
  }

  async retire() {
    const val = this.cniForm.value;
    // console.log(val);
    const cnn = this.cniForm.controls.cnid.value;
    const alert = await this.alertCtrl.create({
      cssClass: 'my-alert',
      header: 'Confirmation',
      message:
        '<p> Bénéficiaire: ' + this.nomR + '</p> <br>' +
        '<p> Numéro CNI: ' + cnn + '</p> <br>' +
        '<p> Téléphone: ' + this.teleR + '</p> <br>' +
        '<p> Emétteur: ' + this.nomD + '</p> <br>' +
        '<p> Téléphone: ' + this.teleD + '</p> <br>' +
        '<p> Montant: ' + this.montant + ' fcfa</p> <br>'
      ,
      buttons: [
        {
          text: 'Annuler',
        },
        {
          text: 'Confirmer',
          handler: (data: any) => {
            this.loadingAnim();
            this.req.retrait(this.idCompte, this.idUser, this.code, val).subscribe(
              async res => {
                this.trans = res;
                this.commission = this.trans[`fraisRetrait`];
                console.log(this.commission);
                // this.req.doRefresh();
                this.updateSolde(this.solde, this.montant, this.commission);
                this.loading.dismiss();
                const alertResult = await this.alertCtrl.create({
                  cssClass: 'my-resp',
                  header: 'Retrait réussi',
                  message: 'Retrait fait avec succès.'
                  ,
                  buttons: [
                    {
                      text: 'OK',
                      handler: () => {
                        this.router.navigate(['/host/principal'], {queryParams: {solde: this.solde}});
                      }
                    }]
                });
                await alertResult.present();
              });
          }
        }
        ]
    });
    await alert.present();
  }
  async loadingAnim() {
    this.loading = await this.loadingCtrl.create({
      message: 'Chargement en cours...',
    });
    return await this.loading.present();
  }
  updateSolde(solde: number, montant: number, commission: number) {
    this.solde = (solde + montant + commission);
  }
}
