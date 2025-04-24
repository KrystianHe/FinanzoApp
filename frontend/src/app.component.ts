import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="app-container" [class.landing-page]="isLandingPage">
      <!-- Navigation bar -->
      <nav *ngIf="shouldShowNavigation()" class="nav-bar">
        <div class="logo-container">
          <img src="assets/logoMW.png" alt="MW Logo" class="logo">
        </div>
        <div class="nav-buttons">
          <button class="nav-button" (click)="navigateTo('dashboard')">Dashboard</button>
          <button class="nav-button" (click)="navigateTo('transactions')">Transakcje</button>
          <button class="nav-button" (click)="navigateTo('budgets')">Budżety</button>
          <button class="nav-button" (click)="navigateTo('expenses')">Wydatki</button>
        </div>
        <button class="logout-button" (click)="logout()">Wyloguj</button>
      </nav>

      <!-- Main content -->
      <main [ngClass]="{'with-nav': shouldShowNavigation(), 'landing-page': isLandingPage}">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f0f8ff;

      &.landing-page {
        margin: 0;
        padding: 0;
      }
    }

    .nav-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      background-color: #0066cc;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }

    .logo-container {
      width: 120px;
    }

    .logo {
      height: 40px;
      width: auto;
    }

    .nav-buttons {
      display: flex;
      gap: 20px;
    }

    .nav-button {
      background-color: transparent;
      border: none;
      color: white;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 16px;
      border-radius: 4px;
      transition: background-color 0.3s;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    .logout-button {
      background-color: #004999;
      border: none;
      color: white;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 16px;
      border-radius: 4px;
      transition: background-color 0.3s;

      &:hover {
        background-color: #003366;
      }
    }

    main {
      padding: 20px;
      
      &.with-nav {
        padding-top: 80px;
      }

      &.landing-page {
        margin: 0;
        padding: 0;
      }
    }
  `]
})
export class AppComponent {
  isLoggedIn = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.authService.isLoggedIn$.subscribe(
      loggedIn => this.isLoggedIn = loggedIn
    );
  }

  shouldShowNavigation(): boolean {
    return this.isLoggedIn && !this.isLandingPage;
  }

  get isLandingPage(): boolean {
    return this.router.url === '/' || this.router.url === '/home';
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout();
  }
}
