import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import {NoopAnimationsModule, BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TokenInterceptor} from "./interceptor/TokenInterceptor";
import {JWT_OPTIONS, JwtHelperService} from "@auth0/angular-jwt";
import {ConfigService} from "./services/config.service";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { HomeGuestComponent } from './home-guest/home-guest.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { LoginComponent } from './login/login.component';
import { DialogComponent } from './dialog/dialog.component';
import { UserService } from './services/user.service';
import { CreateProfileComponent } from './create-profile/create-profile.component';





const routes: Routes = [
  { path: '', component: HomeGuestComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'profileSetup', component: CreateProfileComponent},

];


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeGuestComponent,
    DialogComponent,
    CreateProfileComponent,
  ],

  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgxCaptchaModule,
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule,

  ],
  exports: [RouterModule],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, JwtHelperService, ConfigService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
