import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {ParticlesComponent} from '../../shared/components/particles.component';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,ParticlesComponent],
  template: `
    <div class="verify-page">
      <app-particles></app-particles>
      <div class="verify-container">
        <div class="verify-header">
          <img src="assets/finanzo-logo.jpg" alt="Finanzo" class="logo">
          <h2>Weryfikacja konta</h2>
          <p>Podaj kod weryfikacyjny wysłany na Twój adres email</p>
        </div>

        <form (ngSubmit)="onSubmit()" #verifyForm="ngForm" class="verify-form">
          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-group">
              <i class="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="email"
                required
                readonly
              >
            </div>
          </div>

          <div class="form-group">
            <label for="code">Kod weryfikacyjny</label>
            <div class="input-group">
              <i class="fas fa-key"></i>
              <input
                type="text"
                id="code"
                name="code"
                [(ngModel)]="code"
                required
                placeholder="Wprowadź kod weryfikacyjny"
              >
            </div>
          </div>

          <div *ngIf="message" class="alert" [ngClass]="{'alert-success': !error, 'alert-error': error}">
            {{ message }}
          </div>

          <button type="submit" [disabled]="!verifyForm.form.valid || isLoading" class="submit-btn">
            <span *ngIf="!isLoading">Weryfikuj</span>
            <span *ngIf="isLoading">Weryfikacja...</span>
            <i class="fas fa-check" *ngIf="!isLoading"></i>
          </button>

          <p class="login-link">
            Zweryfikowany? <a routerLink="/login">Zaloguj się</a>
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

    .verify-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #14162E;
      margin: 0;
      padding: 0;
      position: relative;
    }

    .verify-container {
      background: rgba(255, 255, 255, 0.95);
      padding: 2.5rem;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      border-radius: 12px;
      z-index: 1;
    }

    .verify-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .logo {
      max-width: 120px;
      height: auto;
      margin: 0 auto 1rem;
      display: block;
      object-fit: contain;
      border-radius: 8px;
    }

    .verify-header h2 {
      color: #2c3e50;
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .verify-header p {
      color: #7f8c8d;
      font-size: 1rem;
    }

    .verify-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      color: #34495e;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .input-group {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-group i {
      position: absolute;
      left: 1rem;
      color: #7f8c8d;
      font-size: 1rem;
    }

    input {
      width: 100%;
      padding: 0.8rem 1rem 0.8rem 2.5rem;
      border: 2px solid #ecf0f1;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    input::placeholder {
      color: #bdc3c7;
    }

    input[readonly] {
      background-color: #f8f9fa;
      color: #6c757d;
    }

    .alert {
      padding: 1rem;
      border-radius: 10px;
      font-size: 0.9rem;
    }

    .alert-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .alert-error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .submit-btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      margin-top: 1rem;
    }

    .submit-btn:hover {
      background: #2563eb;
    }

    .submit-btn:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }

    .submit-btn i {
      font-size: 1rem;
    }

    .login-link {
      text-align: center;
      margin-top: 1.5rem;
      color: #7f8c8d;
    }

    .login-link a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
    }

    .login-link a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .verify-container {
        padding: 2rem;
        margin: 1rem;
        max-width: 100%;
      }
    }
  `]
})
export class VerifyComponent implements OnInit {
  email: string = '';
  code: string = '';
  message: string = '';
  error: boolean = false;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      }
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.message = '';
    this.error = false;

    this.http.post(`${environment.apiUrl}/auth/verify`, {
      email: this.email,
      code: this.code
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.message = 'Weryfikacja zakończona pomyślnie. Możesz się teraz zalogować.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.error = true;
        this.message = error.error?.message || 'Błąd weryfikacji. Spróbuj ponownie.';
        console.error('Błąd weryfikacji:', error);
      }
    });
  }
}
