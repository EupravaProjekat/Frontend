import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  _api_url: string;
  _login_url: string;
  _register_url: string;
  _profile_url: string;
  _profile_edit_url: string;
  


  constructor() {
    this._api_url = 'http://localhost:9090'; // Adjust the port as needed
    this._login_url = this._api_url + '/login';
    this._register_url = this._api_url + '/register';
    this._profile_url = this._api_url + '/profile';
    this._profile_edit_url = this._api_url + '/update-profile';
  }
}
