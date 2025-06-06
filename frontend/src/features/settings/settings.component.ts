import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="dashboard-layout">
      <div class="sidebar">
        <div class="logo-container">
          <img src="assets/finanzo-logo.jpg" alt="Finanzo" class="logo">
        </div>
        <div class="sidebar-menu">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="menu-item">
            <i class="fas fa-home"></i>
            <span>Dashboard</span>
          </a>
          <a routerLink="/transactions" routerLinkActive="active" class="menu-item">
            <i class="fas fa-wallet"></i>
            <span>Transakcje</span>
          </a>
          <a routerLink="/budgets" routerLinkActive="active" class="menu-item">
            <i class="fas fa-hand-holding-usd"></i>
            <span>Budżety</span>
          </a>
          <a routerLink="/analytics" routerLinkActive="active" class="menu-item">
            <i class="fas fa-chart-pie"></i>
            <span>Analityka</span>
          </a>
          <a routerLink="/savings" routerLinkActive="active" class="menu-item">
            <i class="fas fa-piggy-bank"></i>
            <span>Oszczędności</span>
          </a>
          <a routerLink="/goals" routerLinkActive="active" class="menu-item">
            <i class="fas fa-bullseye"></i>
            <span>Cele</span>
          </a>
          <a routerLink="/settings" routerLinkActive="active" class="menu-item">
            <i class="fas fa-cog"></i>
            <span>Ustawienia</span>
          </a>
          <div class="menu-separator"></div>
          <a (click)="logout()" class="menu-item logout-item">
            <i class="fas fa-sign-out-alt"></i>
            <span>Wyloguj się</span>
          </a>
        </div>
      </div>

      <div class="welcome-container">
        <div class="welcome-card">
          <div class="page-header">
            <h1>Ustawienia</h1>
            <p>Dostosuj aplikację do swoich potrzeb</p>
          </div>

          <div class="settings-grid">
            <!-- Profil -->
            <div class="card">
              <div class="card-header">
                <i class="fas fa-user"></i>
                <h2>Profil</h2>
              </div>
              <div class="card-content">
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" [(ngModel)]="userEmail" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Aktualne hasło</label>
                  <input type="password" [(ngModel)]="currentPassword" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Nowe hasło</label>
                  <input type="password" [(ngModel)]="newPassword" class="form-input" />
                </div>
                <button class="btn btn-primary" (click)="updateProfile()">Zapisz zmiany</button>
              </div>
            </div>

            <!-- Personalizacja -->
            <div class="card">
              <div class="card-header">
                <i class="fas fa-paint-brush"></i>
                <h2>Personalizacja</h2>
              </div>
              <div class="card-content">
                <div class="form-group">
                  <label>Motyw</label>
                  <select [(ngModel)]="selectedTheme" class="form-input">
                    <option value="dark">Ciemny</option>
                    <option value="light">Jasny</option>
                    <option value="system">Systemowy</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Język</label>
                  <select [(ngModel)]="selectedLanguage" class="form-input">
                    <option value="pl">Polski</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <button class="btn btn-primary" (click)="updatePersonalization()">Zapisz zmiany</button>
              </div>
            </div>

            <!-- Kategorie -->
            <div class="card">
              <div class="card-header">
                <i class="fas fa-tags"></i>
                <h2>Kategorie wydatków</h2>
              </div>
              <div class="card-content">
                <div class="categories-list">
                  <div *ngFor="let category of categories" class="category-item">
                    <div class="category-color" [style.background-color]="category.color"></div>
                    <input type="text" [(ngModel)]="category.name" class="form-input category-name" />
                    <input type="color" [(ngModel)]="category.color" class="color-picker" />
                    <button class="btn btn-icon btn-danger" (click)="deleteCategory(category)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                <button class="btn btn-outline" (click)="addCategory()">
                  <i class="fas fa-plus"></i> Dodaj kategorię
                </button>
              </div>
            </div>

            <!-- Powiadomienia -->
            <div class="card">
              <div class="card-header">
                <i class="fas fa-bell"></i>
                <h2>Powiadomienia</h2>
              </div>
              <div class="card-content">
                <div class="notification-setting">
                  <label class="toggle-label">
                    <input type="checkbox" [(ngModel)]="notifications.email">
                    <span class="toggle-slider"></span>
                    Powiadomienia email
                  </label>
                  <p class="text-muted">Otrzymuj raporty i alerty na email</p>
                </div>
                <div class="notification-setting">
                  <label class="toggle-label">
                    <input type="checkbox" [(ngModel)]="notifications.budget">
                    <span class="toggle-slider"></span>
                    Alerty o budżecie
                  </label>
                  <p class="text-muted">Powiadomienia gdy przekroczysz 80% budżetu</p>
                </div>
                <div class="notification-setting">
                  <label class="toggle-label">
                    <input type="checkbox" [(ngModel)]="notifications.goals">
                    <span class="toggle-slider"></span>
                    Przypomnienia o celach
                  </label>
                  <p class="text-muted">Powiadomienia o postępach w celach</p>
                </div>
                <button class="btn btn-primary" (click)="updateNotifications()">Zapisz zmiany</button>
              </div>
            </div>

            <!-- Eksport danych -->
            <div class="card">
              <div class="card-header">
                <i class="fas fa-download"></i>
                <h2>Eksport danych</h2>
              </div>
              <div class="card-content">
                <div class="export-option">
                  <h3>Transakcje</h3>
                  <p class="text-muted">Eksportuj historię transakcji w wybranym formacie</p>
                  <div class="btn-group">
                    <button class="btn btn-outline" (click)="exportData('transactions', 'csv')">CSV</button>
                    <button class="btn btn-outline" (click)="exportData('transactions', 'pdf')">PDF</button>
                  </div>
                </div>
                <div class="export-option">
                  <h3>Budżety</h3>
                  <p class="text-muted">Eksportuj dane budżetów i ich wykorzystanie</p>
                  <div class="btn-group">
                    <button class="btn btn-outline" (click)="exportData('budgets', 'csv')">CSV</button>
                    <button class="btn btn-outline" (click)="exportData('budgets', 'pdf')">PDF</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100%;
    }

    .dashboard-layout {
      display: flex;
      height: 100%;
      background-color: #14162E;
      color: white;
    }

    .sidebar {
      width: 250px;
      background-color: #1A1C36;
      display: flex;
      flex-direction: column;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      z-index: 10;
    }

    .logo-container {
      padding: 1.5rem;
      text-align: center;
    }

    .logo {
      width: 120px;
      height: auto;
      object-fit: contain;
      border-radius: 8px;
    }

    .sidebar-menu {
      display: flex;
      flex-direction: column;
      margin-top: 1rem;
      height: 100%;
    }

    .menu-item {
      display: flex;
      align-items: center;
      padding: 0.8rem 1.5rem;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .menu-item i {
      font-size: 1.2rem;
      width: 30px;
      margin-right: 0.5rem;
    }

    .menu-item:hover {
      background: rgba(255, 255, 255, 0.08);
      color: white;
      cursor: pointer;
    }

    .menu-item.active {
      background: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
      border-left: 3px solid #3b82f6;
    }

    .menu-separator {
      height: 1px;
      margin: auto 1.5rem 1rem;
      background-color: rgba(255, 255, 255, 0.1);
    }

    .logout-item {
      margin-top: auto;
      margin-bottom: 1rem;
      color: #e55c5c;
    }

    .logout-item:hover {
      background: rgba(229, 92, 92, 0.1);
      color: #ff6b6b;
    }

    .welcome-container {
      flex: 1;
      padding: 2rem;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      overflow-y: auto;
    }

    .welcome-card {
      background: rgba(30, 31, 61, 0.5);
      padding: 2.5rem;
      border-radius: 1rem;
      width: 100%;
      max-width: 1400px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 600;
      color: #e4e6f1;
      margin-bottom: 0.75rem;
    }

    .page-header p {
      color: #9ca3af;
      font-size: 1.25rem;
    }

    .settings-grid {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .card {
      width: 100%;
      background: #1A1C36;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .card-header {
      background: rgba(59, 130, 246, 0.1);
      padding: 1.75rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .card-header i {
      font-size: 1.75rem;
      color: #3b82f6;
    }

    .card-header h2 {
      color: #e4e6f1;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }

    .card-content {
      padding: 2.5rem;
    }

    .form-group {
      margin-bottom: 2rem;
      max-width: 800px;
    }

    .form-group label {
      display: block;
      color: #9ca3af;
      margin-bottom: 0.75rem;
      font-size: 1.1rem;
    }

    .form-input {
      width: 100%;
      padding: 1rem;
      border-radius: 0.75rem;
      border: 1px solid #2d3748;
      background: #242848;
      color: #e4e6f1;
      font-size: 1.1rem;
    }

    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .btn {
      padding: 1rem 2rem;
      border-radius: 0.75rem;
      font-weight: 500;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
      border: none;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-outline {
      background: transparent;
      border: 1px solid #3b82f6;
      color: #3b82f6;
    }

    .btn-outline:hover {
      background: rgba(59, 130, 246, 0.1);
    }

    .btn-danger {
      background: #ef4444;
      color: white;
      border: none;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .btn-group {
      display: flex;
      gap: 1rem;
    }

    .categories-list {
      margin-bottom: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
      gap: 1.25rem;
    }

    .category-item {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      margin-bottom: 1rem;
      background: rgba(255, 255, 255, 0.03);
      padding: 1rem;
      border-radius: 8px;
      transition: background 0.3s ease;
    }

    .category-item:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .category-color {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .category-name {
      flex: 1;
    }

    .color-picker {
      width: 36px;
      height: 36px;
      padding: 0;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
    }

    .notification-setting {
      margin-bottom: 2rem;
    }

    .toggle-label {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      color: #e4e6f1;
      cursor: pointer;
      font-size: 1.1rem;
    }

    .toggle-slider {
      position: relative;
      width: 56px;
      height: 30px;
      background: #2d3748;
      border-radius: 12px;
      transition: all 0.2s;
    }

    .toggle-slider:before {
      content: '';
      position: absolute;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: white;
      top: 3px;
      left: 3px;
      transition: all 0.2s;
    }

    input[type="checkbox"] {
      display: none;
    }

    input[type="checkbox"]:checked + .toggle-slider {
      background: #3b82f6;
    }

    input[type="checkbox"]:checked + .toggle-slider:before {
      transform: translateX(26px);
    }

    .text-muted {
      color: #9ca3af;
      font-size: 1rem;
      margin-top: 0.5rem;
    }

    .export-option {
      margin-bottom: 2.5rem;
      max-width: 800px;
    }

    .export-option h3 {
      color: #e4e6f1;
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    @media (max-width: 768px) {
      .dashboard-layout {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
        height: auto;
      }

      .sidebar-menu {
        flex-direction: row;
        overflow-x: auto;
        margin-top: 0;
      }

      .menu-item {
        padding: 0.8rem 1.2rem;
      }

      .menu-item i {
        margin-right: 0.3rem;
      }

      .menu-separator {
        width: 1px;
        height: auto;
        margin: 0 0.5rem;
      }

      .logout-item {
        margin-top: 0;
        margin-bottom: 0;
      }

      .settings-grid {
        max-width: 100%;
      }

      .categories-list {
        grid-template-columns: 1fr;
      }

      .card-content {
        padding: 1.5rem;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  userEmail: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  selectedTheme: string = 'dark';
  selectedLanguage: string = 'pl';
  categories: any[] = [
    { name: 'Zakupy spożywcze', color: '#f97316' },
    { name: 'Transport', color: '#3b82f6' },
    { name: 'Rozrywka', color: '#a855f7' },
    { name: 'Rachunki', color: '#ea580c' }
  ];
  notifications = {
    email: true,
    budget: true,
    goals: false
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    try {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData && parsedUserData.email) {
          this.userEmail = parsedUserData.email;
        }
      }

      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.selectedTheme = savedTheme;
      }

      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage) {
        this.selectedLanguage = savedLanguage;
      }

      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications);
        if (parsedNotifications) {
          this.notifications = {
            ...this.notifications,
            ...parsedNotifications
          };
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  updateProfile(): void {
    if (this.newPassword) {
      this.authService.changePassword(this.currentPassword, this.newPassword)
        .subscribe({
          next: () => {
            console.log('Password updated successfully');
            this.currentPassword = '';
            this.newPassword = '';
          },
          error: (error: any) => console.error('Error updating password:', error)
        });
    }
  }

  updatePersonalization(): void {
    try {
      localStorage.setItem('theme', this.selectedTheme);
      localStorage.setItem('language', this.selectedLanguage);
      console.log('Personalization settings updated');
    } catch (error) {
      console.error('Error saving personalization settings:', error);
    }
  }

  addCategory(): void {
    this.categories.push({
      name: 'Nowa kategoria',
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    });
  }

  deleteCategory(category: any): void {
    const index = this.categories.indexOf(category);
    if (index > -1) {
      this.categories.splice(index, 1);
    }
  }

  updateNotifications(): void {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
      console.log('Notification settings updated');
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  exportData(type: string, format: string): void {
    console.log(`Exporting ${type} in ${format} format...`);
  }

  logout(): void {
    localStorage.removeItem('user_data');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
