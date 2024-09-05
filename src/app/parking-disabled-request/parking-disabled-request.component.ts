import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../services/auth.service';
import { PersonalDocumentService } from '../services/personal-document.service';

@Component({
  selector: 'app-parking-disabled-request',
  templateUrl: './parking-disabled-request.component.html',
  styleUrl: './parking-disabled-request.component.css'
})
export class ParkingDisabledRequestComponent implements OnInit{

  modeli: { [key: string]: string[] } = {
    audi: ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "Q8", "RS3", "RS6", "TT"],
    bmw: ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "8 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "i3", "i8", "Z4"],
    mercedes: ["A-Class", "B-Class", "C-Class", "E-Class", "S-Class", "CLA", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "AMG GT"],
    toyota: ["Corolla", "Camry", "RAV4", "Yaris", "Auris", "Prius", "Highlander", "Land Cruiser", "Hilux", "Supra", "C-HR"],
    honda: ["Civic", "Accord", "CR-V", "HR-V", "Jazz", "Pilot", "Fit", "Odyssey"],
    ford: ["Fiesta", "Focus", "Mondeo", "Mustang", "Explorer", "Escape", "Ranger", "F-150", "Edge", "Kuga"],
    chevrolet: ["Spark", "Sonic", "Cruze", "Malibu", "Impala", "Equinox", "Traverse", "Tahoe", "Suburban", "Camaro", "Corvette", "Silverado"],
    volkswagen: ["Golf", "Polo", "Passat", "Tiguan", "Touareg", "Arteon", "Jetta", "T-Roc", "T-Cross", "ID.3", "ID.4"],
    hyundai: ["i10", "i20", "i30", "Kona", "Tucson", "Santa Fe", "Elantra", "Sonata", "Veloster", "Nexo"],
    nissan: ["Micra", "Juke", "Qashqai", "X-Trail", "Navara", "Leaf", "370Z", "GT-R"],
    kia: ["Picanto", "Rio", "Ceed", "Stonic", "Sportage", "Sorento", "Niro", "Optima", "Stinger"],
    peugeot: ["208", "308", "508", "2008", "3008", "5008", "Rifter", "Traveller"],
    renault: ["Clio", "Megane", "Kadjar", "Captur", "Koleos", "Scenic", "Talisman"],
    fiat: ["Panda", "500", "Tipo", "Punto", "Ducato", "Doblo", "Fiorino"],
    mazda: ["Mazda2", "Mazda3", "Mazda6", "CX-3", "CX-5", "CX-9", "MX-5"],
    subaru: ["Impreza", "Forester", "Outback", "XV", "WRX", "BRZ"],
    jeep: ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator"],
    volvo: ["XC40", "XC60", "XC90", "S60", "S90", "V60", "V90"],
    mitsubishi: ["Mirage", "Lancer", "Outlander", "Eclipse Cross", "Pajero", "ASX"],
    landrover: ["Defender", "Discovery", "Range Rover", "Range Rover Evoque", "Range Rover Velar"],
    jaguar: ["XE", "XF", "XJ", "F-Pace", "E-Pace", "I-Pace", "F-Type"],
    porsche: ["911", "Cayenne", "Macan", "Panamera", "Taycan", "Boxster"],
    tesla: ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck", "Roadster"],
    alfaRomeo: ["Giulia", "Stelvio", "Giulietta", "4C", "8C"],
  citroen: ["C1", "C3", "C4", "C5", "C3 Aircross", "C5 Aircross", "Berlingo"],
  dacia: ["Sandero", "Duster", "Logan", "Dokker", "Lodgy"],
  mini: ["Mini 3-Door", "Mini 5-Door", "Clubman", "Countryman", "Convertible", "John Cooper Works"],
  suzuki: ["Swift", "Baleno", "Vitara", "S-Cross", "Ignis", "Jimny"],
  skoda: ["Fabia", "Octavia", "Superb", "Karoq", "Kodiaq", "Kamiq"]
  };
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private documentService: PersonalDocumentService
  ) {}

  openDialog(message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: 'Обавештење', message: message },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (message === 'Login successful') {
        this.router.navigate(['/profile']);
      }
    });
  }
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    // Dodaj event listener za promenu selektovane marke
    const markaSelect = document.getElementById('marka') as HTMLSelectElement;
    markaSelect.addEventListener('change', () => this.updateModel());
  }

  updateModel(): void {
    console.log('updateModel pozvan'); // Dodaj ovaj log
    const marka = (document.getElementById('marka') as HTMLSelectElement).value.toLowerCase();
    console.log('Selektovana marka:', marka); // Dodaj ovaj log

    const modelSelect = document.getElementById('model') as HTMLSelectElement;

    // Očisti trenutne opcije modela
    modelSelect.innerHTML = '<option value="">--Izaberite model--</option>';

    if (this.modeli[marka]) {
      this.modeli[marka].forEach(model => {
        const option = document.createElement('option');
        option.value = model.toLowerCase();
        option.textContent = model;
        modelSelect.appendChild(option);
      });
    } else {
      console.log('Nema modela za izabranu marku'); // Dodaj ovaj log
    }
  }

  submitRequest() {

    const requestData = {
      // jmbg: this.appointmentForm.get('jmbg')?.value,
      // name: this.appointmentForm.get('name')?.value,
      // email: this.appointmentForm.get('email')?.value,
      // requestNumber: this.generateRequestNumber(),
      // date: this.selectedDate,
      // time: this.selectedTime,
    };

    if(requestData != null) {
      this.documentService.submitAppointmentRequest(requestData);
    }
    console.log(requestData);

  }
}
