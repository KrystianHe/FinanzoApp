import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-container">
      <!-- Sidebar -->
      <nav class="sidebar">
        <div class="sidebar-header">
          <img src="assets/logo.png" alt="Logo" class="logo">
          <h2 class="app-name">Wydatki</h2>
        </div>
        
        <div class="sidebar-menu">
          <a routerLink="/dashboard" routerLinkActive="active" class="menu-item">
            <i class="fas fa-home"></i>
            <span>Dashboard</span>
          </a>
          
          <a routerLink="/transactions" routerLinkActive="active" class="menu-item">
            <i class="fas fa-exchange-alt"></i>
            <span>Transakcje</span>
          </a>

          <a routerLink="/budgets" routerLinkActive="active" class="menu-item">
            <i class="fas fa-hand-holding-usd"></i>
            <span>Budżety</span>
          </a>
          
          <a routerLink="/statistics" routerLinkActive="active" class="menu-item">
            <i class="fas fa-chart-bar"></i>
            <span>Statystyki</span>
          </a>
          
          <a routerLink="/settings" routerLinkActive="active" class="menu-item">
            <i class="fas fa-cog"></i>
            <span>Ustawienia</span>
          </a>
        </div>

        <div class="sidebar-footer">
          <button class="logout-btn" (click)="logout()">
            <i class="fas fa-sign-out-alt"></i>
            <span>Wyloguj</span>
          </button>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
      background: #0f1120;
    }

    .sidebar {
      width: 280px;
      background: #1A1C36;
      display: flex;
      flex-direction: column;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      position: fixed;
      height: 100vh;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo {
      height: 40px;
      width: auto;
    }

    .app-name {
      color: #e4e6f1;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }

    .sidebar-menu {
      padding: 1.5rem 0;
      flex: 1;
    }

    .menu-item {
      display: flex;
      align-items: center;
      padding: 0.875rem 1.5rem;
      color: #9ca3af;
      text-decoration: none;
      transition: all 0.2s;
      gap: 1rem;
      font-size: 1rem;
    }

    .menu-item i {
      font-size: 1.25rem;
      width: 24px;
      text-align: center;
    }

    .menu-item:hover {
      color: #e4e6f1;
      background: rgba(255, 255, 255, 0.05);
    }

    .menu-item.active {
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      position: relative;
    }

    .menu-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #3b82f6;
      border-radius: 0 4px 4px 0;
    }

    .sidebar-footer {
      padding: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logout-btn {
      width: 100%;
      padding: 0.875rem;
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      transition: all 0.2s;
      font-size: 1rem;
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.2);
    }

    .main-content {
      flex: 1;
      padding: 2rem;
      margin-left: 280px;
      width: calc(100% - 280px);
      min-height: 100vh;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 80px;
      }

      .app-name,
      .menu-item span,
      .logout-btn span {
        display: none;
      }

      .menu-item {
        justify-content: center;
        padding: 0.875rem;
      }

      .menu-item i {
        margin: 0;
        font-size: 1.5rem;
      }

      .sidebar-header {
        padding: 1rem;
        justify-content: center;
      }

      .logo {
        height: 32px;
      }

      .main-content {
        margin-left: 80px;
        width: calc(100% - 80px);
      }
    }
  `]
})
export class LayoutComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
} 