import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser :any;
  constructor(
    private apiService: ApiService,
    private config: ConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog

  ) { }
  getOne(email : string) {
    return this.apiService.get(this.config._profile_url+"/"+email);
  }
  register(userToSave:any) {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const body = {
      'email': userToSave.email,
      // 'role' : userToSave.role,
      'password' : userToSave.password
    };

    console.log(userToSave.email)


    return this.apiService.post(this.config._register_url, JSON.stringify(body), loginHeaders)
      .subscribe((res) => {
        if(res.body == "NOT_ACCEPTABLE" || res.name == "HttpErrorResponse")
        {
          alert("Грешка!")
        }else {
          this.openDialog('Линк за верификацију је послат на ' + body.email);
          console.log(res)
          let returnUrl : String;
        }
      });
  }
  saveUser(userToSave:any) {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const body = {

      'email': userToSave.email
    };

    return this.apiService.post(this.config._profile_edit_url, JSON.stringify(body), loginHeaders)
      .subscribe((res) => {
        if(res.body == "NOT_ACCEPTABLE" || res.name == "HttpErrorResponse")
        {
          this.openDialog("Грешка у чувању измена на профилу!")
        }else {
          this.openDialog("Кориснички профил успешно ажуриран!");
          console.log(res)
          let returnUrl : String;
        }
      });
  }

  openDialog(message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { message: message },
    });

  }

}
