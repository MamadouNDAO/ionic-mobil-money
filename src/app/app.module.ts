import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {authInterceptorProviders} from './services/interceptor.service';
import {IonicStorageModule} from '@ionic/storage';
import {DepotPage} from './pages/depot/depot.page';
import {CommonModule, DatePipe} from '@angular/common';
import {JWT_OPTIONS, JwtHelperService} from '@auth0/angular-jwt';
import {PrincipalPage} from './pages/principal/principal.page';
import {LoginPage} from './pages/login/login.page';



@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    CommonModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    LoginPage,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    authInterceptorProviders,
    JwtHelperService,
    DatePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
