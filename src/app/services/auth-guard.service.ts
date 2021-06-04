import { Injectable } from '@angular/core';
import {TokenService} from './token.service';
import {AuthService} from './auth.service';
import {ActivatedRouteSnapshot, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  token: string;
  constructor(
    private tokenService: TokenService,
    private auth: AuthService,
    public router: Router
  ) { }
  async myToken() {
    this.token = await this.tokenService.getToken();
  }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isAuthenticated())
    {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
