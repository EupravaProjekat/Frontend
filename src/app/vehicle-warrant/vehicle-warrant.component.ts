import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '../services/config.service';
import { VehicleWarrantService } from '../services/vehicle-warrant.service';
import moment from 'moment';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-vehicle-warrant',
  templateUrl: './vehicle-warrant.component.html',
  styleUrl: './vehicle-warrant.component.css'
})
export class VehicleWarrantComponent {
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
    private vehicleWarrantService: VehicleWarrantService,
  ) {
    // if(this.authService.isAuthenticated())
    // {
    //
    // }
    // else {
    //
    //   this.router.navigate(['/']);
    // }
    this.appointmentForm = this.fb.group({
      carPlateNumber: ['', [Validators.required]],
    });
  }

  selectedDate: string | null = null;
  selectedTime: string | null = null;

  ngOnInit(): void {
    this.generateDates();
    this.generateTimeSlots();
    // this.authService.checkdata();
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
        carPlateNumber: this.appointmentForm.get('carPlateNumber')?.value,
      };
      return true;
    }
    else {
      return false
    }


  }
  submitRequest() {

    const requestData = {
      carPlateNumber: this.appointmentForm.get('carPlateNumber')?.value,
    };

    if(requestData != null) {
      this.vehicleWarrantService.submitAppointmentRequest(requestData);
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
