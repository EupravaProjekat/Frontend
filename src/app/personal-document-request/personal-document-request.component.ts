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
export class PersonalDocumentRequestComponent implements OnInit {

  dates: string[] = [];// Define and initialize viewDate
  documentForm: FormGroup;
  isAgreed = false;
  showError = false;
  showInfoBox = false;
  currentTab = 'tab-1';
  familyMembers = [
    {name: '', jmbg: ''},
    {name: '', jmbg: ''},
    {name: '', jmbg: ''},
    {name: '', jmbg: ''}
  ];
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

  selectedDate: string | null = null;
  selectedTime: string | null = null;

  ngOnInit(): void {
    this.generateDates();
    this.generateTimeSlots();
    ;
    this.generateWorkWeekDates();
  }

  generateDates(): void {
    const today = moment().startOf('isoWeek');  // Počnite od ponedeljka
    for (let i = 0; i < 7; i++) {  // Prikazivanje 7 dana (nedeljni pregled)
      this.dates.push(today.clone().add(i, 'days').format('DD.MM. (ddd)'));
    }
  }

  generateWorkWeekDates() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Get the current day of the week (0 = Sunday, 6 = Saturday)

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Calculate the start of the workweek (Monday)

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      if (currentDay.getDay() === 0 || currentDay.getDay() === 6) {
        continue; // Skip Saturday and Sunday
      }
      const formattedDate = currentDay.toLocaleDateString('sr-RS', {day: '2-digit', month: '2-digit', year: 'numeric'});
      this.dates.push(formattedDate);
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



  isPause(timeRange: string): boolean {
    // Helper function to convert time string to minutes since start of the day
    const timeToMinutes = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    // Define pause intervals in minutes since start of the day
    const pauseStart1 = timeToMinutes('09:00');
    const pauseEnd1 = timeToMinutes('09:30');
    const pauseStart2 = timeToMinutes('16:30');
    const pauseEnd2 = timeToMinutes('17:00');

    // Split the input time range into start and end times
    const [start, end] = timeRange.split('-').map(time => time.trim());

    // Convert input times to minutes since start of the day
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);

    // Check if the interval overlaps with any pause interval
    const overlapsWithPause = (start: number, end: number, pauseStart: number, pauseEnd: number): boolean => {
      return start < pauseEnd && end > pauseStart;
    };

    return overlapsWithPause(startMinutes, endMinutes, pauseStart1, pauseEnd1) ||
      overlapsWithPause(startMinutes, endMinutes, pauseStart2, pauseEnd2);
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

  isSelected(date: string, timeRange: string): boolean {
    return this.selectedDate === date && this.selectedTime === timeRange;
  }


  selectTimeSlot(date: string, timeRange: string) {
    if (!this.isPause(timeRange)) {
      this.selectedDate = date;
      this.selectedTime = timeRange;
    }
  }


  schedule() {
    // Implement scheduling logic
    console.log('Appointment scheduled for', this.selectedDate, this.selectedTime);
  }

  cancel() {
    this.selectedDate = null;
    this.selectedTime = null;
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
      data: {title: 'Обавештење', message: message},
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
