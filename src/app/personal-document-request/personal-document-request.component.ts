import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '../services/config.service';
import { PersonalDocumentService } from '../services/personal-document.service';
import moment from 'moment';

@Component({
  selector: 'app-personal-document-request',
  templateUrl: './personal-document-request.component.html',
  styleUrl: './personal-document-request.component.css'
})
export class PersonalDocumentRequestComponent implements OnInit{

  viewDate: Date = new Date();  // Define and initialize viewDate
  documentForm: FormGroup;
  isAgreed = false;
  showError = false;
  showInfoBox = false;
  currentTab = 'tab-1';
  familyMembers = [
    { name: '', jmbg: '' },
    { name: '', jmbg: '' },
    { name: '', jmbg: '' },
    { name: '', jmbg: '' }
  ];

  dates: string[] = [];
  timeSlots: string[] = [];
  constructor(
    private fb: FormBuilder,

    private http: HttpClient,
    private router: Router,
    private config: ConfigService,
    private dialog: MatDialog,
    private authService: AuthService,
    private documentService: PersonalDocumentService
  ) {
    this.documentForm = this.fb.group({
      jmbg: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      familyMembers: this.fb.array([
        this.createFamilyMember(),
        this.createFamilyMember(),
        this.createFamilyMember(),
        this.createFamilyMember()
      ])
    });
  }

  ngOnInit(): void {
    this.generateDates();
    this.generateTimeSlots();;
  }

  generateDates(): void {
    const today = moment().startOf('isoWeek');  // Počnite od ponedeljka
    for (let i = 0; i < 7; i++) {  // Prikazivanje 7 dana (nedeljni pregled)
      this.dates.push(today.clone().add(i, 'days').format('DD.MM. (ddd)'));
    }
  }

  generateTimeSlots(): void {
    const startTime = moment().startOf('day').hour(7);  // Početak u 7:00
    const endTime = moment().startOf('day').hour(22);  // Kraj u 22:00
    while (startTime.isBefore(endTime)) {
      this.timeSlots.push(startTime.format('HH:mm') + '-' + startTime.clone().add(15, 'minutes').format('HH:mm'));
      startTime.add(15, 'minutes');
    }
  }
  isPause(time: string): boolean {
    return time === '09:00-09:15' || time === '09:15-09:30';
  }
  createFamilyMember(): FormGroup {
    return this.fb.group({
      name: [''],
      jmbg: ['', Validators.pattern(/^\d{13}$/)]
    });
  }

  checkForm(documentForm: FormGroup): boolean {

    if (this.areFieldsEmpty()) {
      this.openDialog('Молимо вас да попуните сва поља!');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(documentForm.value.email)) {
      this.openDialog('Неисправна имејл адреса!');
      return false;
    }
    // if (documentForm.value.email !== currentUserEmail)
    // {
    //   this.openDialog('Молимо Вас да користите адресу електронске поште која одговара Вашем е-Управа налогу!');
    //   return false;
    // }


    let msgElement = document.getElementById("msg");
    let msgText = msgElement?.textContent;

    return true;
  }

  areFieldsEmpty(): boolean {
    let isEmpty = false;
    Object.keys(this.documentForm.controls).forEach((field) => {
      const control = this.documentForm.get(field);
      if (control && control.value === '') {
        isEmpty = true;
        this.setInvalidClass(field, true);
      }
    });
    return isEmpty;
  }

  setInvalidClass(controlName: string, condition?: boolean): boolean {
    const control = this.documentForm.get(controlName);

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
  get FamilyMembers(): FormArray {
    return this.documentForm.get('familyMembers') as FormArray;
  }

  toggleInfoBox() {
    this.showInfoBox = !this.showInfoBox;
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

  onSubmit() {
    if (!this.isAgreed) {
      this.showError = true;
      this.openDialog('Молимо вас да прихватите услове.');
    } else {
      this.showError = false;
      if (this.currentTab === 'tab-1') {
        this.setTab('tab-2');
      } else if (this.currentTab === 'tab-2') {
        this.setTab('tab-3');
      } else if (this.currentTab === 'tab-3') {
        this.submitForm();
      }
    }
  }
  submitForm() {
    if (this.checkForm(this.documentForm) == true) {
      this.documentService.submitAppointmentRequest(this.documentForm.value)
    }


    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.openDialog('Грешка приликом добављања података о кориснику!');
      return;
    }

    const requestData = this.documentForm.value;
    requestData.email = currentUser.email;

    this.documentService.submitAppointmentRequest(requestData).subscribe(
      (response) => {
        console.log('Захтев за резервисање термина успешно послат', response);
        this.openDialog('Захтев је успешно послат.');
        this.router.navigate(['/personalDocument']); // Pretpostavljam da postoji ruta za uspeh
      },
      (error) => {
        console.error('Грешка приликом слања захтева за резервацију', error);
        this.openDialog('Дошло је до грешке приликом слања захтева.');
      }
    );
  }

  goBack() {
    if (this.currentTab === 'tab-2') {
      this.setTab('tab-1');
    } else if (this.currentTab === 'tab-3') {
      this.setTab('tab-2');
    } else {
      this.router.navigate(['/previous-page']); // Ili navigacija na početnu stranicu
    }
  }

  setTab(tabName: string) {
    this.currentTab = tabName;
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
}
