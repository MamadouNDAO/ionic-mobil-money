import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageService} from '../../services/message.service';
import {RequestService} from '../../services/request.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-calcul',
  templateUrl: './calcul.page.html',
  styleUrls: ['./calcul.page.scss'],
})
export class CalculPage implements OnInit {
  errorMessages = {
    montant: undefined
  };
  montForm: FormGroup;
  private loading: HTMLIonLoadingElement;
  constructor(
    private msg: MessageService,
    private req: RequestService,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private router: Router
    ) { }
  get montant() {
    return this.montForm.get('montant');
  }
  ngOnInit() {
    this.initForm();
    this.errorMessages = this.msg.errorMessage;
  }
  initForm() {
    this.montForm = new FormGroup({
      montant: new FormControl('', [Validators.required])
    });
  }

  returnHome() {
    this.router.navigate(['/host/principal']);
  }

  runCalcul(montant: any) {
    this.loadingAnim();
    this.req.getFrais(montant.value).subscribe(
      async res => {
        await this.loading.dismiss();
        const alertResult = await this.alertCtrl.create({
          cssClass: 'my-resp',
          header: 'Calculateur',
          message:
            '<p> Pour une transaction de ' + montant.value + ', le frais est égal à:</p> <br>' +
            '<h3>' + res + '</h3>'
          ,
          buttons: [
            {
              text: 'Retour',
              handler: () => {
                this.initForm();
              }
            }
          ]
        });
        await alertResult.present();
      }
    );
  }
  async loadingAnim() {
    this.loading = await this.loadingCtrl.create({
      message: 'Calcul en cours...',
    });
    return await this.loading.present();
  }
}
