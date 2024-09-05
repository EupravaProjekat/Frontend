import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../services/auth.service';
import { ParkingDisabledService } from '../services/parking-disabled.service';

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
  parkingPermitForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private parkingDisabledService: ParkingDisabledService
  ) {
    this.parkingPermitForm = this.fb.group({
      city: ['', Validators.required],
      requestParkingCard: [false],
      requestReservedParking: [false],
      requestType: [false],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      idNumber: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      municipality: ['', Validators.required],
      postalCode: ['', Validators.required],
      entrance: [''],
      floor: [''],
      place: ['', Validators.required],
      street: [''],
      streetNumber: [''],
      apartment: [''],
      addition: [''],
      previousDecision: [''],
      propertyVehicle: ['', Validators.required],
      registrationPlate: ['', Validators.required],
      marka: ['', Validators.required],
      model: [''],
      isLeased: [false],
      termsOfUse: [false],
    });
  }

  checkForm(parkingPermitForm: FormGroup): boolean {
    if (this.areFieldsEmpty()) {
      this.openDialog('Молимо вас да попуните форму!');
      return false;
    }

    if((parkingPermitForm.get('termsOfUse')?.value) != true){
      this.openDialog('Молимо вас да прочитате и прихватите све услове пре него што наставите са коришћењем ове услуге.');
      return false;
    }

    // Validacija JMBG
    const idNumberRegex = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])(\d{3})(\d{6})$/;
    if(!idNumberRegex.test(parkingPermitForm.get('idNumber')?.value)){
      this.openDialog('Неисправан матичан број');
      return false;
    }

    // Validacija email-a
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(parkingPermitForm.get('email')?.value)) {
      this.openDialog('Неисправна имејл адреса!');
      return false;
    }

    return true; // Ako su sve validacije uspešne, vraća true
  }

  areFieldsEmpty(): boolean {
    let isEmpty = false;
    const optionalFields = ['entrance', 'floor', 'apartment', 'addition'];

    Object.keys(this.parkingPermitForm.controls).forEach((field) => {
      const control = this.parkingPermitForm.get(field);

      // Preskoči polja koja mogu biti prazna
      if (optionalFields.includes(field)) {
        return;
      }

      if (control && control.value === '') {
        isEmpty = true;
        this.setInvalidClass(field, true);
      }
    });

    return isEmpty;
  }

  setInvalidClass(controlName: string, condition?: boolean): boolean {
    const control = this.parkingPermitForm.get(controlName);

    if (condition !== undefined) {
      if (control && condition && (control.dirty || control.touched)) {
        return true;
      } else {
        return false;
      }
    }

    if (control && control.invalid && (control.dirty || control.touched)) {
      return true;
    }

    return false;
  }


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
    modelSelect.innerHTML = '<option value="">--Изаберите модел--</option>';

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

      if(this.checkForm(this.parkingPermitForm)){
        const requestData = {

          city: this.parkingPermitForm.get('city')?.value,
          requestParkingCard: this.parkingPermitForm.get('requestParkingCard')?.value,
          requestReservedParking: this.parkingPermitForm.get('requestReservedParking')?.value,
          firstName: this.parkingPermitForm.get('firstName')?.value,
          lastName: this.parkingPermitForm.get('lastName')?.value,
          idNumber: this.parkingPermitForm.get('idNumber')?.value,
          phone: this.parkingPermitForm.get('phone')?.value,
          email: this.parkingPermitForm.get('email')?.value,
          municipality: this.parkingPermitForm.get('municipality')?.value,
          postalCode: this.parkingPermitForm.get('postalCode')?.value,
          entrance: this.parkingPermitForm.get('entrance')?.value,
          floor: this.parkingPermitForm.get('floor')?.value,
          place: this.parkingPermitForm.get('place')?.value,
          street: this.parkingPermitForm.get('street')?.value,
          streetNumber: this.parkingPermitForm.get('streetNumber')?.value,
          apartment: this.parkingPermitForm.get('apartment')?.value,
          addition: this.parkingPermitForm.get('addition')?.value,
          previousDecision: this.parkingPermitForm.get('previousDecision')?.value,
          propertyVehicle: this.parkingPermitForm.get('propertyVehicle')?.value,
          registrationPlate: this.parkingPermitForm.get('registrationPlate')?.value,
          marka: this.parkingPermitForm.get('marka')?.value,
          model: this.parkingPermitForm.get('model')?.value,
          isLeased: this.parkingPermitForm.get('isLeased')?.value

        };

        if(requestData != null) {
          this.parkingDisabledService.submitParkingRequest(requestData);
        }
        console.log(requestData);

      }









  }
}
