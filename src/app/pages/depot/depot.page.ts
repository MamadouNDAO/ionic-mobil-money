import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, IonSlides, LoadingController, ModalController, PopoverController} from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageService} from '../../services/message.service';
import {RequestService} from '../../services/request.service';


@Component({
  selector: 'app-depot',
  templateUrl: './depot.page.html',
  styleUrls: ['./depot.page.scss'],
})
export class DepotPage implements OnInit {
  isEmettor = true;
  isDestinator = false;
  loading: any;
  selectedSlide: any;
  errorMessages = {
    cni: undefined,
    nom: undefined,
    phone: undefined,
    montant: undefined

  };
  segment = 0;
  sliderOptions = {
    initialSlide: 0,
    slidePerView: 1,
    speed: 400
  };
  public emetForm: FormGroup;
  idUser: number;
  idAgence: number;
  idCompte: number;
  solde: number;
  frais = 0;
  code: any;
  sended = false;
  constructor(
    private router: Router,
    private msg: MessageService,
    private route: ActivatedRoute,
    private req: RequestService,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
  ) { }
  get montant() {
    return this.emetForm.get('montant');
  }
  get nomD() {
    return this.emetForm.get('clientDepot.nom');
  }
  get phoneD() {
    return this.emetForm.get('clientDepot.telephone');
  }
  get cnid() {
    return this.emetForm.get('clientDepot.cnid');
  }
  get nomR() {
    return this.emetForm.get('clientRetrait.nom');
  }
  get phoneR() {
    return this.emetForm.get('clientRetrait.telephone');
  }
  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.idUser = params.iduser;
        this.idAgence = params.idAgence;
        this.idCompte = params.idComp;
        this.solde = params.solde;
      }
    );
    this.initEmitForm();
    this.errorMessages = this.msg.errorMessage;
  }
  segmentChanged(ev: any){
    this.isEmettor = !this.isEmettor;
    this.isDestinator = !this.isDestinator;
  }

  initEmitForm(){
    this.emetForm = new FormGroup({
      montant: new FormControl(500, [Validators.required]),
      clientDepot: new FormGroup({
        cnid: new FormControl('', [Validators.required,
          Validators.pattern('^[0-9\\s]*$'), Validators.minLength(16), Validators.maxLength(16)]),
        nom: new FormControl('', Validators.required),
        telephone: new FormControl('', [Validators.pattern('^[0-9]*$'),
          Validators.required, Validators.maxLength(9), Validators.minLength(9)]),
      }),
      clientRetrait: new FormGroup({
        nom: new FormControl('', Validators.required),
        telephone: new FormControl('', [Validators.pattern('^[0-9]*$'),
          Validators.required, Validators.maxLength(9), Validators.minLength(9)]),
      }),
    });
  }

  async saveDepot() {
    const val = this.emetForm.value;
    const telephone = Number(val.clientDepot.telephone);
    const telephones = Number(val.clientRetrait.telephone);
    val.clientDepot.telephone = telephone;
    val.clientRetrait.telephone = telephones;
    console.log(val);
    const alert = await this.alertCtrl.create({
      cssClass: 'my-alert',
      header: 'Résumé dépot',
      message:
          '<p> Emetteur: ' + val.clientDepot.nom + '</p> <br>' +
          '<p> Numéro CNI: ' + val.clientDepot.cnid + '</p> <br>' +
          '<p> Téléphone: ' + val.clientDepot.telephone + '</p> <br>' +
          '<p> Destinataire: ' + val.clientRetrait.nom + '</p> <br>' +
          '<p> Téléphone: ' + val.clientRetrait.telephone + '</p> <br>' +
          '<p> Montant: ' + val.montant + ' fcfa</p> <br>' +
          '<p> Frais: ' + this.frais + ' fcfa</p> <br>'
      ,
      buttons: [
        {
          text: 'Annuler',
        },
        {
          text: 'Confirmer',
          handler: (data: any) => {
            this.loadingAnim();
            this.req.depot(this.idUser, this.idCompte, val).subscribe(
              async res => {
                this.loading.dismiss();
                // this.req.doRefresh();
                this.solde = this.updateSolde(this.solde, val.montant, this.frais);
                const alertResult = await this.alertCtrl.create({
                  cssClass: 'my-resp',
                  header: 'Transfert réussi',
                  message:
                    '<p> Vous avez envoyé ' + val.montant + ' à ' + val.clientRetrait.nom + '</p> <br>' +
                    '<p> Code: ' + res + '</p> <br>'
                  ,
                  buttons: [
                    {
                      text: 'OK',
                      handler: () => {
                        this.router.navigate(['/host/principal'], {queryParams: {solde: this.solde}});
                      }
                    }
                  ]
                });
                await alertResult.present();
              }
            );
          }
        }
      ]
    });

    await alert.present();

  }
  async loadingAnim() {
    this.loading = await this.loadingCtrl.create({
      message: 'Connexion en cours...',
    });
    return await this.loading.present();
  }
  returnHome() {
    this.router.navigate(['/host/principal']);
  }

  checkFrais(mont) {
    this.req.getFrais(mont.value).subscribe(
      res => {
        this.frais = res;
      });
  }

  spaced(cn: any) {
    if (cn.value.length == 1 || cn.value.length == 5 || cn.value.length == 10 ) {
      cn.value = cn.value + ' ';
    }
  }
  updateSolde(solde: number, montant: number, frais: number) {
    const commission = (frais * 10) / 100;
    const soust = (montant + frais);
    return solde = (solde - soust) + commission;
  }
}
