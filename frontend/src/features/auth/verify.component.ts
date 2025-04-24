import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="verify-container">
      <div class="verify-card">
        <div class="logo-container">
          <img src="assets/logoMW.jpg" alt="MW Logo" class="logo">
        </div>
        <h2>Weryfikacja konta</h2>
        
        <div class="content">
          <div *ngIf="isLoading" class="loading">
            <div class="spinner"></div>
            <p>Weryfikacja w toku...</p>
          </div>

          <div *ngIf="!isLoading && !isVerified && !error" class="message">
            <p>Sprawdź swoją skrzynkę email i kliknij w link weryfikacyjny.</p>
            <p>Nie otrzymałeś emaila?</p>
            <button (click)="resendVerification()" [disabled]="isResending">
              {{ isResending ? 'Wysyłanie...' : 'Wyślij ponownie' }}
            </button>
          </div>

          <div *ngIf="isVerified" class="success">
            <i class="fas fa-check-circle"></i>
            <p>Twoje konto zostało pomyślnie zweryfikowane!</p>
            <button (click)="navigateToLogin()">Przejdź do logowania</button>
          </div>

          <div *ngIf="error" class="error">
            <i class="fas fa-exclamation-circle"></i>
            <p>{{ error }}</p>
            <button (click)="tryAgain()">Spróbuj ponownie</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .verify-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, rgba(30, 60, 114, 0.8) 0%, rgba(42, 82, 152, 0.8) 100%);
      padding: 20px;
    }

    .verify-card {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
      text-align: center;
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
      color: #1e3c72;
      margin-bottom: 30px;
    }

    .content {
      margin-top: 20px;
    }

    .message, .success, .error {
      margin: 20px 0;

      p {
        margin: 10px 0;
        color: #333;
      }
    }

    .success {
      color: #28a745;
    }

    .error {
      color: #dc3545;
    }

    button {
      margin-top: 20px;
      padding: 12px 24px;
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

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #1e3c72;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class VerifyComponent implements OnInit {
  isLoading = false;
  isVerified = false;
  isResending = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.verifyToken(token);
    }
  }

  verifyToken(token: string) {
    this.isLoading = true;
    this.error = null;

    this.authService.verifyEmail(token).subscribe({
      next: () => {
        this.isLoading = false;
        this.isVerified = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.message || 'Wystąpił błąd podczas weryfikacji konta';
      }
    });
  }

  resendVerification() {
    this.isResending = true;
    this.error = null;

    this.authService.resendVerification().subscribe({
      next: () => {
        this.isResending = false;
      },
      error: (error) => {
        this.isResending = false;
        this.error = error.message || 'Nie udało się wysłać emaila weryfikacyjnego';
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  tryAgain() {
    this.error = null;
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.verifyToken(token);
    }
  }
} 