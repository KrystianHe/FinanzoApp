import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="user-header">
      <div class="header-container">
        <div class="logo">
          <h1>MojeWydatki</h1>
        </div>
        <div class="user-info">
          <div class="user-avatar">
            {{ userInitials }}
          </div>
          <button (click)="logout()" class="logout-btn">
            <i class="fas fa-sign-out-alt"></i>
            Wyloguj
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .user-header {
      background-color: #17b978;
      color: white;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background-color: #086972;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .logout-btn {
      background-color: transparent;
      border: 1px solid white;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .logout-btn i {
      font-size: 1rem;
    }
  `]
})
export class UserHeaderComponent implements OnInit {
  userInitials: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userInitials = (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 