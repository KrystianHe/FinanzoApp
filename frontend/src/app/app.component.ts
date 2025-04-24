import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav *ngIf="showNavbar" class="navbar">
      <div class="navbar-container">
        <div class="logo">
          <img src="assets/logoMW.png" alt="MW Logo">
        </div>
        <div class="nav-links">
          <a routerLink="/dashboard" class="nav-link">Dashboard</a>
          <a routerLink="/expenses" class="nav-link">Wydatki</a>
          <a routerLink="/categories" class="nav-link">Kategorie</a>
          <a routerLink="/reports" class="nav-link">Raporty</a>
        </div>
        <div class="user-menu">
          <button (click)="logout()" class="logout-btn">
            <i class="fas fa-sign-out-alt"></i>
            Wyloguj
          </button>
        </div>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, rgba(30, 60, 114, 0.8) 0%, rgba(42, 82, 152, 0.8) 100%);
      padding: 1rem 2rem;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .logo img {
      height: 40px;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }

    .nav-link:hover {
      color: #17b978;
    }

    .logout-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      transition: color 0.3s;
    }

    .logout-btn:hover {
      color: #17b978;
    }
  `]
})
export class AppComponent {
  showNavbar = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !['/login', '/register', '/verify'].includes(event.url);
      }
    });
  }

  logout() {
    // Implement logout logic here
    this.router.navigate(['/login']);
  }
}
