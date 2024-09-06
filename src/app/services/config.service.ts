import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  _api_url: string;
  _login_url: string;
  _check_url: string;
  _register_url: string;
  _profile_url: string;
  _profile_setup_url: string;
  _profile_edit_url: string;
  _getTicket_url: string;
  _activate_url: string;
  _reset_request_url: string;
  _reset_password_url: string;
  _weapon_request_url: string;
  _document_request_url: string;
  _appointments_url: string;
  _check_border_url: string;
  _parking_request_url: string;
  _save_border_user_url: string;

  _get_all_causings_url: string;
  _prosecution_check_url: string;
  _prosecute_url: string;
  //ODKOMENTARISI AKO ZATREBA//
  // _border_police_request1_url: string;

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
    this._appointments_url = this._api_url + '/appointments';
    this._document_request_url = this._api_url + '/document-request';
    this._parking_request_url = this._api_url + '/parking-request';
    this._save_border_user_url = "http://localhost:9099/adddata"
    this._check_url ="http://localhost:9099/checkifuserexists";
    this._check_border_url ="http://localhost:9098/profile";
    this._get_all_causings_url="http://localhost:9098/getallcausings";
    this._border_police_request_url = "http://localhost:9098/newrequest";
    this._prosecution_check_url = "http://localhost:9199/check-if-person-is-prosecuted";
    this._prosecute_url = "http://localhost:9199/prosecute";
    // this._border_police_request1_url = "http://localhost:9098/newrequest1";
  }
}
