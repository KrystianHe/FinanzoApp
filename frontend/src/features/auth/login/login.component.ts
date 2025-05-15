import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ParticlesComponent } from '../../shared/components/particles.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ParticlesComponent],
  template: `
    <div class="login-page">
      <app-particles></app-particles>
      <div class="login-container">
        <div class="login-header">
          <img src="assets/finanzo-logo.jpg" alt="Finanzo" class="logo">
          <h2>Witaj ponownie w Finanzo</h2>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <div class="input-group">
              <i class="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                formControlName="email"
                placeholder="Email"
                [class.error]="isFieldInvalid('email')"
              >
            </div>
            <div class="error-message" *ngIf="isFieldInvalid('email')">
              Proszę podać prawidłowy adres email
            </div>
          </div>

          <div class="form-group">
            <div class="input-group">
              <i class="fas fa-lock"></i>
              <input
                type="password"
                id="password"
                formControlName="password"
                placeholder="Hasło"
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
            Nie masz konta? <a routerLink="/register">Zarejestruj się</a>
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
      /* Dodaję style, które ukryją sidebar */
      & ~ app-root .sidebar,
      & ~ app-root .app-header {
        display: none !important;
      }
    }

    .login-page {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #14162E;
      overflow: hidden;
      position: relative;
    }

    .login-container {
      background: rgba(255, 255, 255, 0.95);
      padding: 2.2rem;
      width: 94%;
      max-width: 440px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      border-radius: 12px;
      z-index: 1;
    }

    .login-header {
      text-align: center;
      margin-bottom: 1.8rem;
    }

    .logo {
      width: 140px;
      height: auto;
      margin: 0 auto 1.2rem;
      display: block;
      object-fit: contain;
      border-radius: 8px;
    }

    .login-header h2 {
      color: #2c3e50;
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .login-header p {
      color: #7f8c8d;
      font-size: 0.85rem;
      margin-bottom: 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 0.3rem;
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
      left: 0.9rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      font-size: 1.1rem;
      z-index: 1;
    }

    input {
      width: 100%;
      padding: 0.9rem 0.9rem 0.9rem 2.6rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1.1rem;
      background: #f8fafc;
      transition: all 0.3s ease;
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
      margin-top: 0.3rem;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .checkbox-group input[type="checkbox"] {
      width: 1.1rem;
      height: 1.1rem;
      margin: 0;
    }

    .checkbox-group label {
      color: #64748b;
      font-size: 0.95rem;
      font-weight: normal;
    }

    .submit-btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.9rem;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 500;
      cursor: pointer;
      width: 100%;
      margin-top: 0.5rem;
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
      font-size: 0.9rem;
      text-align: center;
      margin-top: 0.5rem;
    }

    .register-link {
      text-align: center;
      margin-top: 1.2rem;
      color: #64748b;
      font-size: 0.95rem;
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
        padding: 1.8rem;
        width: 90%;
        max-width: 400px;
      }

      .logo {
        width: 120px;
      }

      input, .submit-btn {
        font-size: 1rem;
        padding: 0.8rem 0.8rem 0.8rem 2.4rem;
      }

      .input-group i {
        font-size: 1rem;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl: string = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [false]
    });

    // Pobierz returnUrl z query params, jeśli istnieje
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/dashboard';
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit() {
    this.login();
  }

  login(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Upewnij się, że formularz jest poprawny
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Błąd logowania. Sprawdź email i hasło.';
        }
      });
    } else {
      this.isLoading = false;
      this.errorMessage = 'Wypełnij poprawnie wszystkie pola.';
    }
  }
}
