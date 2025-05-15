import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ParticlesComponent } from '../../shared/components/particles.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, ParticlesComponent],
  template: `
    <div class="register-page">
      <app-particles></app-particles>
      <div class="register-container">
        <div class="register-header">
          <img src="assets/finanzo-logo.jpg" alt="Finanzo" class="logo">
          <h2>Dołącz do Finanzo</h2>
          <p>Stwórz konto i zacznij kontrolować swoje finanse</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Imię</label>
              <div class="input-group">
                <i class="fas fa-user"></i>
                <input
                  type="text"
                  id="firstName"
                  formControlName="firstName"
                  placeholder="Wprowadź imię"
                  [class.error]="isFieldInvalid('firstName')"
                >
              </div>
              <div class="error-message" *ngIf="isFieldInvalid('firstName')">
                Imię jest wymagane
              </div>
            </div>

            <div class="form-group">
              <label for="lastName">Nazwisko</label>
              <div class="input-group">
                <i class="fas fa-user"></i>
                <input
                  type="text"
                  id="lastName"
                  formControlName="lastName"
                  placeholder="Wprowadź nazwisko"
                  [class.error]="isFieldInvalid('lastName')"
                >
              </div>
              <div class="error-message" *ngIf="isFieldInvalid('lastName')">
                Nazwisko jest wymagane
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-group">
              <i class="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                formControlName="email"
                placeholder="Wprowadź adres email"
                [class.error]="isFieldInvalid('email')"
              >
            </div>
            <div class="error-message" *ngIf="isFieldInvalid('email')">
              Wprowadź prawidłowy adres email
            </div>
          </div>

          <div class="form-group">
            <label for="dateOfBirth">Data urodzenia</label>
            <div class="input-group">
              <i class="fas fa-calendar"></i>
              <input
                type="date"
                id="dateOfBirth"
                formControlName="dateOfBirth"
                [class.error]="isFieldInvalid('dateOfBirth')"
              >
            </div>
            <div class="error-message" *ngIf="isFieldInvalid('dateOfBirth')">
              Data urodzenia jest wymagana
            </div>
          </div>

          <div class="form-group">
            <label for="password">Hasło</label>
            <div class="input-group">
              <i class="fas fa-lock"></i>
              <input
                type="password"
                id="password"
                formControlName="password"
                placeholder="Wprowadź hasło"
                [class.error]="isFieldInvalid('password')"
              >
            </div>
            <div class="error-message" *ngIf="isFieldInvalid('password')">
              Hasło musi mieć co najmniej 8 znaków
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Potwierdź hasło</label>
            <div class="input-group">
              <i class="fas fa-lock"></i>
              <input
                type="password"
                id="confirmPassword"
                formControlName="confirmPassword"
                placeholder="Potwierdź hasło"
                [class.error]="isFieldInvalid('confirmPassword')"
              >
            </div>
            <div class="error-message" *ngIf="isFieldInvalid('confirmPassword')">
              Hasła muszą być identyczne
            </div>
          </div>

          <div class="form-group terms">
            <div class="checkbox-group">
              <input
                type="checkbox"
                id="terms"
                formControlName="terms"
                [class.error]="isFieldInvalid('terms')"
              >
              <label for="terms">Akceptuję regulamin i politykę prywatności</label>
            </div>
            <div class="error-message" *ngIf="isFieldInvalid('terms')">
              Musisz zaakceptować regulamin
            </div>
          </div>

          <button type="submit" [disabled]="registerForm.invalid || isLoading" class="submit-btn">
            {{ isLoading ? 'Rejestracja...' : 'Zarejestruj się' }}
          </button>

          <div *ngIf="errorMessage" class="error-alert">
            {{ errorMessage }}
          </div>

          <p class="login-link">
            Masz już konto? <a routerLink="/login">Zaloguj się</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      max-width: 100%;
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1001; /* wyższy niż sidebar */
      background-color: #14162E;
    }
    
    .register-page {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #14162E;
      overflow: hidden;
      position: relative;
    }

    .register-container {
      background: rgba(255, 255, 255, 0.95);
      padding: 1.8rem;
      width: 92%;
      max-width: 480px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      border-radius: 12px;
      z-index: 1;
    }

    .register-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .logo {
      width: 120px;
      height: auto;
      margin: 0 auto 1rem;
      display: block;
      object-fit: contain;
      border-radius: 8px;
    }

    .register-header h2 {
      color: #2c3e50;
      font-size: 1.3rem;
      margin-bottom: 0.3rem;
      font-weight: 600;
    }

    .register-header p {
      color: #7f8c8d;
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.9rem;
      width: 100%;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    label {
      color: #34495e;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .input-group {
      position: relative;
      width: 100%;
    }

    .input-group i {
      position: absolute;
      left: 0.8rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      font-size: 0.9rem;
      z-index: 1;
    }

    input {
      width: 100%;
      padding: 0.65rem 0.65rem 0.65rem 2.2rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.9rem;
      background: #f8fafc;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    input[type="date"] {
      padding-right: 0.65rem;
    }

    input::placeholder {
      color: #94a3b8;
    }

    input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      background: white;
    }

    .terms {
      margin-top: 0.2rem;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .checkbox-group input[type="checkbox"] {
      width: 0.9rem;
      height: 0.9rem;
      margin: 0;
    }

    .checkbox-group label {
      color: #64748b;
      font-size: 0.8rem;
      font-weight: normal;
    }

    .submit-btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.7rem;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      width: 100%;
      margin-top: 0.4rem;
      transition: all 0.3s ease;
    }

    .submit-btn:hover {
      background: #2563eb;
    }

    .submit-btn:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }

    .error-alert {
      background: #fee2e2;
      color: #dc2626;
      padding: 0.5rem;
      border-radius: 6px;
      font-size: 0.8rem;
      text-align: center;
      width: 100%;
    }

    .login-link {
      text-align: center;
      margin-top: 0.8rem;
      color: #64748b;
      font-size: 0.8rem;
    }

    .login-link a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
    }

    .login-link a:hover {
      text-decoration: underline;
    }

    .error-message {
      color: #dc2626;
      font-size: 0.7rem;
      margin-top: 0.1rem;
    }

    @media (max-width: 768px) {
      .register-container {
        padding: 1.5rem;
        margin: 1rem;
        max-width: 100%;
      }

      .logo {
        width: 100px;
        margin: 0 auto 1rem;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 0.8rem;
      }

      .register-form {
        gap: 0.8rem;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
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
    this.register();
  }

  register(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.registerForm.valid) {
      const registrationData = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        dateOfBirth: this.formatDate(this.registerForm.value.dateOfBirth)
      };

      this.authService.register(registrationData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/verify'], {
            queryParams: { email: registrationData.email }
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Wystąpił błąd podczas rejestracji. Spróbuj ponownie.';
        }
      });
    } else {
      this.isLoading = false;
      this.errorMessage = 'Wypełnij poprawnie wszystkie pola.';
    }
  }

  private formatDate(date: string): string {
    return date ? new Date(date).toISOString().split('T')[0] : '';
  }
}
