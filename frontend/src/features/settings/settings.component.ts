import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <h1>Ustawienia</h1>
      <div class="user-info">
        <p>Zalogowany jako: <strong>{{userEmail}}</strong></p>
      </div>
      <div class="change-password">
        <h2>Zmiana hasła</h2>
        <form (ngSubmit)="changePassword()">
          <div class="form-group">
            <label for="currentPassword">Aktualne hasło:</label>
            <input type="password" id="currentPassword" [(ngModel)]="currentPassword" name="currentPassword" required>
          </div>
          <div class="form-group">
            <label for="newPassword">Nowe hasło:</label>
            <input type="password" id="newPassword" [(ngModel)]="newPassword" name="newPassword" required>
          </div>
          <button type="submit">Zmień hasło</button>
        </form>
      </div>
      <div class="account-actions">
        <h2>Akcje na koncie</h2>
        <button (click)="deactivateAccount()">Dezaktywuj konto</button>
        <button (click)="deleteAccount()">Usuń konto</button>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      background: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      margin-bottom: 1.5rem;
      color: #333;
    }
    .user-info {
      margin-bottom: 2rem;
    }
    .change-password, .account-actions {
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      padding: 0.5rem 1rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background: #0056b3;
    }
  `]
})
export class SettingsComponent implements OnInit {
  userEmail: string = '';
  currentPassword: string = '';
  newPassword: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      this.userEmail = user.email;
    }
  }

  changePassword(): void {
    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe(
      response => {
        alert('Hasło zostało zmienione pomyślnie!');
        this.currentPassword = '';
        this.newPassword = '';
      },
      error => {
        alert('Błąd podczas zmiany hasła: ' + error.message);
      }
    );
  }

  deactivateAccount(): void {
    if (confirm('Czy na pewno chcesz dezaktywować swoje konto?')) {
      this.authService.deactivateAccount().subscribe(
        response => {
          alert('Konto zostało dezaktywowane pomyślnie!');
          this.authService.logout();
        },
        error => {
          alert('Błąd podczas dezaktywacji konta: ' + error.message);
        }
      );
    }
  }

  deleteAccount(): void {
    if (confirm('Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna.')) {
      this.authService.deleteAccount().subscribe(
        response => {
          alert('Konto zostało usunięte pomyślnie!');
          this.authService.logout();
        },
        error => {
          alert('Błąd podczas usuwania konta: ' + error.message);
        }
      );
    }
  }
} 