import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { ProsecutionServiceService } from '../services/prosecution-service.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-prosecution',
  standalone: true,
  imports: [FormsModule, CommonModule], // Add FormsModule here
  templateUrl: './prosecution.component.html',
  styleUrls: ['./prosecution.component.css']
})
export class ProsecutionComponent {
  jmbg: string = ''; // Model for storing JMBG input
  selectedBreachType: number | null = null; // Model for storing selected breach type
  prosecutionResult: string | null = null; // To store the result

  constructor(private prosecutionService: ProsecutionServiceService,private auth: AuthService, private service : UserService, private router: Router) {}

  checkProsecution() {
    if (this.jmbg.length === 13 && !isNaN(Number(this.jmbg))) {
      this.prosecutionService.checkIfUserIsProsecuted(this.jmbg).subscribe({
        next: (response) => {
          this.prosecutionResult = `Prosecution status: ${JSON.stringify(response.body)}`;
        },
        error: (err) => {
          this.prosecutionResult = `Error: ${err.message}`;
        }
      });
    } else {
      this.prosecutionResult = 'JMBG must be exactly 13 numeric characters.';
    }
  }

  submitProsecution() {
    if (this.jmbg.length === 13 && !isNaN(Number(this.jmbg)) && this.selectedBreachType !== null) {
      const breachTypeNumber = Number(this.selectedBreachType);
      
      this.prosecutionService.prosecute(this.jmbg, breachTypeNumber).subscribe({
        next: (response) => {
          this.prosecutionResult = `Prosecution result: ${JSON.stringify(response)}`;
        },
        error: (err) => {
          this.prosecutionResult = `Error: ${err.message}`;
        }
      });
    } else {
      this.prosecutionResult = 'Please fill out both JMBG and breach type correctly.';
    }
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
}
