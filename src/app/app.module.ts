import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import {NoopAnimationsModule, BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule, DatePipe} from "@angular/common";
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import {DateAdapter, MatNativeDateModule } from '@angular/material/core';
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import { WeaponDocumentComponent } from './weapon-document/weapon-document.component';
import { PersonalDocumentComponent } from './personal-document/personal-document.component';
import { PersonalDocumentRequestComponent } from './personal-document-request/personal-document-request.component';
import { WeaponComponent } from './weapon/weapon.component';
import { ParkingDisabledComponent } from './parking-disabled/parking-disabled.component';
import { ParkingDisabledRequestComponent } from './parking-disabled-request/parking-disabled-request.component';
import { VoluntaryMilitaryComponent } from './voluntary-military/voluntary-military.component';
import { VoluntaryMilitaryRequestComponent } from './voluntary-military-request/voluntary-military-request.component';
import { SpecialVehicleComponent } from './special-vehicle/special-vehicle.component';
import { SpecialCargoRequestComponent } from './special-cargo-request/special-cargo-request.component';
import { ExtraditionRequestComponent } from './extradition-request/extradition-request.component';
import { ProsecutionComponent } from './prosecution/prosecution.component';
import { TwoButtonsDialogComponent } from './two-buttons-dialog/two-buttons-dialog.component';






const routes: Routes = [
  { path: '', component: HomeGuestComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'profileSetup', component: CreateProfileComponent},
  { path: 'weaponDocument', component: WeaponComponent},
  { path: 'weaponDocument/request', component: WeaponDocumentComponent},
  { path: 'personalDocument', component: PersonalDocumentComponent},
  { path: 'personalDocument/request', component: PersonalDocumentRequestComponent},
  { path: 'parkingDisabled', component: ParkingDisabledComponent},
  { path: 'parkingDisabled/request', component: ParkingDisabledRequestComponent},
  { path: 'voluntaryMilitary', component: VoluntaryMilitaryComponent},
  { path: 'voluntaryMilitary/request', component: VoluntaryMilitaryRequestComponent},
  { path: 'extraditionRequest', component: ExtraditionRequestComponent},
  { path: 'specialCargoRequest', component: SpecialCargoRequestComponent},
  { path: 'specialVehicle', component: SpecialVehicleComponent},
  { path: 'prosecution', component: ProsecutionComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeGuestComponent,
    DialogComponent,
    TwoButtonsDialogComponent,
    CreateProfileComponent,
    WeaponDocumentComponent,
    PersonalDocumentComponent,
    ParkingDisabledComponent,
    ParkingDisabledRequestComponent,
    PersonalDocumentRequestComponent,
    SpecialVehicleComponent,
    SpecialCargoRequestComponent,
    ExtraditionRequestComponent
  ],

  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
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
    }, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, JwtHelperService, ConfigService, UserService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
