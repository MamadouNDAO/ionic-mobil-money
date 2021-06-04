import { Injectable } from '@angular/core';
import {TokenService} from './token.service';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';

const TOKEN_HEADER_KEY = 'Authorization';
@Injectable({
  providedIn: 'root'
})
export class InterceptorService {
  myToken: string;
  constructor(private token: TokenService) { }
  async myFunct() {
    this.myToken = await this.token.getToken();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.myFunct();
    let authReq = req;
    if (this.myToken != null) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + this.myToken)
          .set('Accept', 'application/json')
      });
    }
    return next.handle(authReq);
  }
}
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
];
