import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  _api_url: string;
  _login_url: string;
  _register_url: string;
  _profile_url: string;
  _profile_setup_url: string;
  _profile_edit_url: string;
  _getTicket_url: string;
  _activate_url: string;
  _reset_request_url: string;
  _reset_password_url: string;
  _weapon_request_url: string;


  constructor() {
    this._api_url = 'http://localhost:9094'; // Adjust the port as needed
    this._login_url = this._api_url + '/login';
    this._register_url = this._api_url + '/register';
    this._profile_url = this._api_url + '/profile';
    this._profile_setup_url = this._api_url + '/profileSetup';
    this._profile_edit_url = this._api_url + '/update-profile';
    this._getTicket_url = this._api_url + '/getTicket';
    this._activate_url = this._api_url + '/activate';
    this._reset_request_url = this._api_url + '/request-reset';
    this._reset_password_url = this._api_url + '/reset';
    this._weapon_request_url = this._api_url + '/weapon-request';
  }
}
