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

  formData: any = null;

  dates: string[] = [];// Define and initialize viewDate
  appointmentForm: FormGroup;
  isAgreed = false;
  showError = false;
  showInfoBox = false;
  currentTab = 'tab-1';
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
    if(this.authService.isAuthenticated())
    {

    }
    else {

      this.router.navigate(['/']);
    }
    this.appointmentForm = this.fb.group({
      jmbg: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  selectedDate: string | null = null;
  selectedTime: string | null = null;

  ngOnInit(): void {
    this.generateDates();
    this.generateTimeSlots();
    this.authService.checkdata();
  }

  generateDates(): void {
    const today = moment().startOf('isoWeek');
    for (let i = 0; i < 7; i++) {
      const date = today.clone().add(i, 'days');
      const dayOfWeek = date.day();
      let formattedDate = date.format('DD.MM. (ddd)');



      this.dates.push(formattedDate);
    }
  }

  generateTimeSlots(): void {
    const startTime = moment().startOf('day').hour(7);
    const endTime = moment().startOf('day').hour(22);
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


  checkForm(appointmentForm: FormGroup): boolean {


    if (this.areFieldsEmpty()) {
      this.openDialog('Молимо вас да попуните форму!');
      return false;
    }

    const jmbgRegex = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])(\d{3})(\d{6})$/;
    if(!jmbgRegex.test(appointmentForm.get('jmbg')?.value)){
      this.openDialog('Неисправан матичан број');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(appointmentForm.get('email')?.value)) {
      this.openDialog('Неисправна имејл адреса!');
      return false;
    }


    return true; // Ako su sve validacije uspešne, vraća true
  }



  areFieldsEmpty(): boolean {
    let isEmpty = false;
    Object.keys(this.appointmentForm.controls).forEach((field) => {
      const control = this.appointmentForm.get(field);
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
    // Izbegni selektovanje za "NE RADI" dane
    if (!this.isPause(timeRange) && !date.includes('(Sat)') && !date.includes('(Sun)')) {
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
    const control = this.appointmentForm.get(controlName);

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
      } else if (this.currentTab === 'tab-2' && this.submitForm()) {
        this.setTab('tab-3');
        this.openDialog("Изаберите слободан термин!")
      } else if (this.currentTab === 'tab-3') {
        this.submitRequest();
      }
    }
  }

  generateRequestNumber(): string {
    // Implement logic to generate a unique request number
    return 'EH17181459'; // Example placeholder
  }



  submitForm() : boolean{
    if (this.checkForm(this.appointmentForm)) {

      const formData = {
        jmbg: this.appointmentForm.get('jmbg')?.value,
        name: this.appointmentForm.get('name')?.value,
        email: this.appointmentForm.get('email')?.value,
      };
      return true;
    }
    else {
      return false
    }


  }
  submitRequest() {

    const requestData = {
      jmbg: this.appointmentForm.get('jmbg')?.value,
      name: this.appointmentForm.get('name')?.value,
      email: this.appointmentForm.get('email')?.value,
      requestNumber: this.generateRequestNumber(),
      date: this.selectedDate,
      time: this.selectedTime,
    };

    if(requestData != null) {
      this.documentService.submitAppointmentRequest(requestData);
    }
    console.log(requestData);

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
