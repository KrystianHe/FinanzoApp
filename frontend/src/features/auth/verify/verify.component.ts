import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="verify-page">
      <div class="verify-container">
        <div class="verify-header">
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
    .verify-page {
      min-height: 100vh;
      display: flex;

      align-items: center;
      justify-content: center;
      background: linear-gradient(rgba(41, 128, 185, 0.9), rgba(44, 62, 80, 0.9));
      padding: 2rem;
    }

    .verify-container {
      background: white;
      border-radius: 20px;
      padding: 2.5rem;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .verify-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .verify-header h2 {
      color: #2c3e50;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .verify-header p {
      color: #7f8c8d;
      font-size: 1.1rem;
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
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
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
      background: #3498db;
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
      background: #2980b9;
      transform: translateY(-2px);
    }

    .submit-btn:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
      transform: none;
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
      color: #3498db;
      text-decoration: none;
      font-weight: 500;
    }

    .login-link a:hover {
      text-decoration: underline;
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
