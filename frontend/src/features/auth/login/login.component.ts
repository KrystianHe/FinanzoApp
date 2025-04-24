import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ParticlesComponent } from '../../shared/components/particles.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, ParticlesComponent],
  template: `
    <div class="login-page">
      <app-particles></app-particles>
      <div class="login-container">
        <div class="login-header">
          <img src="assets/logoMW.jpg" alt="MW Logo" class="logo">
          <h2>Witaj ponownie w MojeWydatki</h2>
          <p>Zaloguj się, aby kontynuować</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
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
              Hasło jest wymagane
            </div>
          </div>

          <div class="form-group terms">
            <div class="checkbox-group">
              <input
                type="checkbox"
                id="remember"
                formControlName="remember"
              >
              <label for="remember">Zapamiętaj mnie</label>
            </div>
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading" class="submit-btn">
            {{ isLoading ? 'Logowanie...' : 'Zaloguj się' }}
          </button>

          <div *ngIf="errorMessage" class="error-alert">
            {{ errorMessage }}
          </div>

          <p class="register-link">
            Nie masz jeszcze konta? <a routerLink="/register">Zarejestruj się</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #2980b9 0%, #2c3e50 100%);
      padding: 0;
      position: relative;
    }

    .login-container {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      position: relative;
      z-index: 1;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo {
      width: 120px;
      height: auto;
      margin: 0 auto 1.5rem;
      display: block;
    }

    .login-header h2 {
      color: #2c3e50;
      font-size: 1.25rem;
      margin-bottom: 0.25rem;
      font-weight: 600;
    }

    .login-header p {
      color: #7f8c8d;
      font-size: 0.85rem;
    }

    .login-form {
      max-width: 500px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    label {
      color: #34495e;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .input-group {
      position: relative;
      width: 100%;
    }

    .input-group i {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      font-size: 0.9rem;
      z-index: 1;
    }

    input {
      width: 100%;
      padding: 0.6rem 0.75rem 0.6rem 2rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 0.85rem;
      background: #f8fafc;
      transition: all 0.3s ease;
      box-sizing: border-box;
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
      margin-top: 0.25rem;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .checkbox-group input[type="checkbox"] {
      width: 1rem;
      height: 1rem;
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
      padding: 0.6rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      width: 100%;
      margin-top: 0.25rem;
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
      padding: 0.6rem;
      border-radius: 6px;
      font-size: 0.8rem;
      text-align: center;
      width: 100%;
    }

    .register-link {
      text-align: center;
      margin-top: 1rem;
      color: #64748b;
      font-size: 0.8rem;
    }

    .register-link a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
    }

    .register-link a:hover {
      text-decoration: underline;
    }

    .error-message {
      color: #dc2626;
      font-size: 0.75rem;
      margin-top: 0.1rem;
    }

    @media (max-width: 768px) {
      .login-container {
        padding: 1rem;
      }

      .login-form {
        gap: 0.5rem;
      }
    }

    @media (min-height: 800px) {
      .login-container {
        padding: 2rem;
      }

      .login-form {
        gap: 1rem;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Wystąpił błąd podczas logowania';
        }
      });
    }
  }
}
