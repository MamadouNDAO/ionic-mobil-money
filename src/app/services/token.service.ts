import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Storage } from '@ionic/storage';

const TOKEN_KEY = 'auth-token';
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private decodedToken: any;
  constructor(private storage: Storage) {}

  public saveToken(key: string, value: string): void {
    this.storage.set(TOKEN_KEY, value);
  }
  public getToken(){
    return this.storage.get(TOKEN_KEY);
  }
  public removeToken(key: string): any{
    return this.storage.remove(TOKEN_KEY);
  }

  decodeToken(token: any): string {
    return jwt_decode(token);
  }
  getRole(token: string): string {
    this.decodedToken = jwt_decode(token);
    return  this.decodedToken.roles;
  }

  getMail(token: string): any {
    this.decodedToken = jwt_decode(token);
    return  this.decodedToken.username;
  }
  getExpiryTime(token: string): any {
    this.decodedToken = jwt_decode(token);
    return  this.decodedToken.exp;
  }
  getDecodedToken(token: string): any {
    this.decodedToken = jwt_decode(token);
    return  this.decodedToken;
  }
}
