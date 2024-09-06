import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-two-buttons-dialog',
  templateUrl: './two-buttons-dialog.component.html',
  styleUrl: './two-buttons-dialog.component.css'
})
export class TwoButtonsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) 
              public data: any, 
              private dialogRef: MatDialogRef<TwoButtonsDialogComponent>,
  ) {}

  

  onOperatorClick(): void {
    this.dialogRef.close('operator');
    
  }

  onGuestClick(): void {
    this.dialogRef.close('guest');
  }
}
