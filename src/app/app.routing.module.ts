import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeGuestComponent } from './home-guest/home-guest.component';

const routes: Routes = [
  { path: '', component: HomeGuestComponent},
  // Dodaj ostale rute
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
