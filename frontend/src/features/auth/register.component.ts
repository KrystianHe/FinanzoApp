import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="logo-container">
          <img src="assets/logoMW.jpg" alt="MW Logo" class="logo">
        </div>
        <h2>Rejestracja</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="firstName">Imię</label>
            <input
              type="text"
              id="firstName"
              formControlName="firstName"
              [class.error]="isFieldInvalid('firstName')"
            >
            <div class="error-message" *ngIf="isFieldInvalid('firstName')">
              Imię jest wymagane
            </div>
          </div>

          <div class="form-group">
            <label for="lastName">Nazwisko</label>
            <input
              type="text"
              id="lastName"
              formControlName="lastName"
              [class.error]="isFieldInvalid('lastName')"
            >
            <div class="error-message" *ngIf="isFieldInvalid('lastName')">
              Nazwisko jest wymagane
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              [class.error]="isFieldInvalid('email')"
            >
            <div class="error-message" *ngIf="isFieldInvalid('email')">
              Proszę podać prawidłowy adres email
            </div>
          </div>

          <div class="form-group">
            <label for="password">Hasło</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              [class.error]="isFieldInvalid('password')"
            >
            <div class="error-message" *ngIf="isFieldInvalid('password')">
              Hasło musi mieć co najmniej 8 znaków
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Potwierdź hasło</label>
            <input
              type="password"
              id="confirmPassword"
              formControlName="confirmPassword"
              [class.error]="isFieldInvalid('confirmPassword')"
            >
            <div class="error-message" *ngIf="isFieldInvalid('confirmPassword')">
              Hasła muszą być identyczne
            </div>
          </div>

          <button type="submit" [disabled]="registerForm.invalid || isLoading">
            {{ isLoading ? 'Rejestracja...' : 'Zarejestruj się' }}
          </button>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>

        <div class="links">
          <a routerLink="/login">Masz już konto? Zaloguj się</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, rgba(30, 60, 114, 0.8) 0%, rgba(42, 82, 152, 0.8) 100%);
      padding: 20px;
    }

    .register-card {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .logo-container {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo {
      height: 60px;
      width: auto;
    }

    h2 {
      text-align: center;
      color: #1e3c72;
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #333;
    }

    input {
      width: 100%;
      padding: 10px;
      border: 2px solid #e1e1e1;
      border-radius: 4px;
      font-size: 16px;
      transition: border-color 0.3s;

      &:focus {
        outline: none;
        border-color: #1e3c72;
      }

      &.error {
        border-color: #dc3545;
      }
    }

    button {
      width: 100%;
      padding: 12px;
      background-color: #1e3c72;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #2a5298;
      }

      &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
      }
    }

    .error-message {
      color: #dc3545;
      font-size: 14px;
      margin-top: 5px;
    }

    .links {
      margin-top: 20px;
      text-align: center;

      a {
        display: block;
        color: #1e3c72;
        text-decoration: none;
        margin: 10px 0;
        font-size: 14px;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { confirmPassword, ...userData } = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: () => {
          this.router.navigate(['/verify']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Wystąpił błąd podczas rejestracji';
        }
      });
    }
  }
} 