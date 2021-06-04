import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {JwtHelperService} from '@auth0/angular-jwt';
import {TokenService} from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiHost: string = environment.apiHost;
  token: string;
  constructor(private http: HttpClient,
              public jwtHelper: JwtHelperService,
              private tokenService: TokenService) { }
  async myToken() {
    this.token = await this.tokenService.getToken();
  }
  connect(data: any): Observable<any> {
    return this.http.post(this.apiHost + 'login_check', data);
  }
  public isAuthenticated(): boolean {
    this.myToken();
    return !this.jwtHelper.isTokenExpired(this.token);
  }
}
