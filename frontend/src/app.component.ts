import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`
    .navbar {
      background: #1e4976;
      padding: 0.75rem 2rem;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .logo {
      display: flex;
      align-items: center;
    }

    .logo-image {
      height: 32px;
      width: auto;
      object-fit: contain;
      object-position: left center;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      margin-left: auto;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
      font-size: 0.9rem;
      padding: 0.5rem 0;
    }

    .nav-link:hover {
      color: white;
    }

    .logout-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      padding: 0.5rem 1rem;
      transition: all 0.2s ease;
      font-size: 0.9rem;
    }

    .logout-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    @media (max-width: 768px) {
      .navbar {
        padding: 0.75rem 1rem;
      }

      .navbar-container {
        gap: 1rem;
      }

      .nav-links {
        display: none;
      }

      .logo-image {
        height: 28px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  showNavbar = false;
  currentUrl = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        const isVerifyPage = this.currentUrl.includes('/verify');
        this.showNavbar = !['/login', '/register', '/home', '/'].includes(this.currentUrl) && !isVerifyPage;
      }
    });

    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
    });
  }

  ngOnInit() {
    this.authService.checkAuthStatus();
  }

  logout() {
    this.authService.logout();
  }
}
