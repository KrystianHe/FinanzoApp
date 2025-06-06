import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Transaction {
  id: number;
  date: Date;
  category: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

@Component({
  selector: 'app-transaction-list',
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
            <h1>Transakcje</h1>
            <button class="add-transaction-btn">
              <i class="fas fa-plus"></i> Dodaj transakcję
            </button>
          </div>

          <div class="card filters-section">
            <div class="filters-row">
              <div class="search-container">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Szukaj transakcji..." [(ngModel)]="searchTerm" (input)="applyFilters()">
              </div>
              <div class="filter-group">
                <label>Typ:</label>
                <select [(ngModel)]="typeFilter" (change)="applyFilters()" class="form-input">
                  <option value="all">Wszystkie</option>
                  <option value="income">Przychody</option>
                  <option value="expense">Wydatki</option>
                </select>
              </div>
              <div class="filter-group">
                <label>Kategoria:</label>
                <select [(ngModel)]="categoryFilter" (change)="applyFilters()" class="form-input">
                  <option value="all">Wszystkie</option>
                  <option value="groceries">Zakupy spożywcze</option>
                  <option value="salary">Wynagrodzenie</option>
                  <option value="entertainment">Rozrywka</option>
                  <option value="transport">Transport</option>
                  <option value="health">Zdrowie</option>
                  <option value="utilities">Rachunki</option>
                  <option value="other">Inne</option>
                </select>
              </div>
              <div class="filter-group">
                <label>Okres:</label>
                <select [(ngModel)]="periodFilter" (change)="applyFilters()" class="form-input">
                  <option value="this-month">Ten miesiąc</option>
                  <option value="last-month">Poprzedni miesiąc</option>
                  <option value="last-3-months">Ostatnie 3 miesiące</option>
                  <option value="last-6-months">Ostatnie 6 miesięcy</option>
                  <option value="this-year">Ten rok</option>
                  <option value="custom">Własny zakres</option>
                </select>
              </div>
            </div>
            <div class="filters-row" *ngIf="periodFilter === 'custom'">
              <div class="date-range">
                <div class="date-input">
                  <label>Od:</label>
                  <input type="date" [(ngModel)]="startDate" (change)="applyFilters()" class="form-input">
                </div>
                <div class="date-input">
                  <label>Do:</label>
                  <input type="date" [(ngModel)]="endDate" (change)="applyFilters()" class="form-input">
                </div>
              </div>
            </div>
          </div>

          <div class="summary-cards">
            <div class="card summary-card income">
              <div class="card-icon">
                <i class="fas fa-arrow-up"></i>
              </div>
              <div class="card-content">
                <h3>Suma przychodów</h3>
                <p class="amount">{{ totalIncome }} zł</p>
              </div>
            </div>
            <div class="card summary-card expenses">
              <div class="card-icon">
                <i class="fas fa-arrow-down"></i>
              </div>
              <div class="card-content">
                <h3>Suma wydatków</h3>
                <p class="amount">{{ totalExpenses }} zł</p>
              </div>
            </div>
            <div class="card summary-card balance">
              <div class="card-icon">
                <i class="fas fa-wallet"></i>
              </div>
              <div class="card-content">
                <h3>Bilans</h3>
                <p class="amount">{{ balance }} zł</p>
              </div>
            </div>
          </div>

          <div class="card transactions-table-container">
            <table class="transactions-table">
              <thead>
                <tr>
                  <th>
                    <div class="th-content" (click)="sortBy('date')">
                      Data
                      <i class="fas fa-sort"></i>
                    </div>
                  </th>
                  <th>
                    <div class="th-content" (click)="sortBy('category')">
                      Kategoria
                      <i class="fas fa-sort"></i>
                    </div>
                  </th>
                  <th>
                    <div class="th-content" (click)="sortBy('description')">
                      Opis
                      <i class="fas fa-sort"></i>
                    </div>
                  </th>
                  <th>
                    <div class="th-content" (click)="sortBy('amount')">
                      Kwota
                      <i class="fas fa-sort"></i>
                    </div>
                  </th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let transaction of transactions">
                  <td>{{ formatDate(transaction.date) }}</td>
                  <td>
                    <div class="category">
                      <span class="category-icon" [ngClass]="transaction.category">
                        <i class="fas" [ngClass]="getCategoryIcon(transaction.category)"></i>
                      </span>
                      <span>{{ getCategoryName(transaction.category) }}</span>
                    </div>
                  </td>
                  <td>{{ transaction.description }}</td>
                  <td class="amount" [ngClass]="transaction.type">
                    {{ transaction.type === 'income' ? '+' : '-' }}{{ Math.abs(transaction.amount).toFixed(2) }} zł
                  </td>
                  <td class="actions">
                    <button class="action-btn edit" (click)="editTransaction(transaction.id)">
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="action-btn delete" (click)="deleteTransaction(transaction.id)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="transactions.length === 0">
                  <td colspan="5" class="no-data">
                    <p>Brak transakcji spełniających kryteria wyszukiwania.</p>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div class="pagination" *ngIf="totalPages > 1">
              <button [disabled]="currentPage === 1" (click)="goToPage(currentPage - 1)">
                <i class="fas fa-chevron-left"></i>
              </button>
              <span>Strona {{ currentPage }} z {{ totalPages }}</span>
              <button [disabled]="currentPage === totalPages" (click)="goToPage(currentPage + 1)">
                <i class="fas fa-chevron-right"></i>
              </button>
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
      padding: 3rem;
      border-radius: 1.5rem;
      width: 100%;
      max-width: 1400px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
      background: linear-gradient(135deg, rgba(26, 28, 54, 0.5), rgba(30, 31, 61, 0.5));
      padding: 2rem;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .page-header h1 {
      font-size: 2.75rem;
      font-weight: 700;
      color: #e4e6f1;
      margin: 0;
      background: linear-gradient(135deg, #e4e6f1, #9ca3af);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }

    .add-transaction-btn {
      background: linear-gradient(135deg, #3b82f6, #60a5fa);
      color: white;
      border: none;
      border-radius: 1rem;
      padding: 1.25rem 2.5rem;
      font-weight: 600;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .add-transaction-btn:hover {
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }

    .add-transaction-btn:active {
      transform: translateY(0);
    }

    .card {
      background: linear-gradient(135deg, #1A1C36, #242848);
      border-radius: 1.25rem;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      margin-bottom: 2.5rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    }

    .filters-section {
      padding: 2.5rem;
    }

    .filters-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .filters-row:last-child {
      margin-bottom: 0;
    }

    .search-container {
      background: rgba(36, 40, 72, 0.5);
      border-radius: 1rem;
      padding: 1rem 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;
    }

    .search-container:focus-within {
      background: rgba(36, 40, 72, 0.8);
      border-color: rgba(59, 130, 246, 0.5);
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    .search-container i {
      color: #9ca3af;
      margin-right: 0.75rem;
      font-size: 1.1rem;
    }

    .search-container input {
      background: none;
      border: none;
      color: #e4e6f1;
      width: 100%;
      outline: none;
      font-size: 1.1rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      min-width: 200px;
    }

    .filter-group label {
      margin-bottom: 0.5rem;
      font-size: 1rem;
      color: #9ca3af;
    }

    .form-input {
      padding: 1rem 1.5rem;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(36, 40, 72, 0.5);
      color: #e4e6f1;
      font-size: 1.1rem;
      width: 100%;
      transition: all 0.3s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: rgba(59, 130, 246, 0.5);
      background: rgba(36, 40, 72, 0.8);
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    .date-range {
      display: flex;
      gap: 1.5rem;
      flex: 1;
    }

    .date-input {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2.5rem;
      margin-bottom: 3rem;
    }

    .summary-card {
      display: flex;
      align-items: center;
      padding: 2.5rem;
      transition: transform 0.3s ease;
    }

    .summary-card:hover {
      transform: translateY(-4px);
    }

    .card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 70px;
      height: 70px;
      border-radius: 1rem;
      font-size: 1.75rem;
      margin-right: 2rem;
      transition: all 0.3s ease;
    }

    .income .card-icon {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1));
      color: #22c55e;
      box-shadow: 0 8px 16px rgba(34, 197, 94, 0.1);
    }

    .expenses .card-icon {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1));
      color: #ef4444;
      box-shadow: 0 8px 16px rgba(239, 68, 68, 0.1);
    }

    .balance .card-icon {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
      color: #3b82f6;
      box-shadow: 0 8px 16px rgba(59, 130, 246, 0.1);
    }

    .card-content h3 {
      margin: 0 0 0.75rem;
      font-size: 1.2rem;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .card-content .amount {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 700;
      color: #e4e6f1;
      letter-spacing: -1px;
    }

    .transactions-table-container {
      padding: 2.5rem;
    }

    .transactions-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      min-width: 800px;
    }

    .transactions-table th {
      padding: 1.5rem;
      text-align: left;
      color: #9ca3af;
      font-weight: 600;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 1.1rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .th-content {
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: color 0.2s;
    }

    .th-content:hover {
      color: #e4e6f1;
    }

    .th-content i {
      margin-left: 0.75rem;
      font-size: 0.9rem;
    }

    .transactions-table td {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: #e4e6f1;
      font-size: 1.1rem;
    }

    .transactions-table tbody tr {
      transition: all 0.3s ease;
    }

    .transactions-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .category {
      display: flex;
      align-items: center;
    }

    .category-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 45px;
      height: 45px;
      border-radius: 12px;
      margin-right: 1.25rem;
      font-size: 1.3rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }

    .amount {
      font-weight: 600;
      font-size: 1.1rem;
    }

    .income {
      color: #22c55e;
    }

    .expense {
      color: #ef4444;
    }

    .actions {
      display: flex;
      gap: 0.75rem;
    }

    .action-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      width: 45px;
      height: 45px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      font-size: 1.2rem;
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .edit:hover {
      background: rgba(59, 130, 246, 0.2);
      border-color: rgba(59, 130, 246, 0.3);
      color: #60a5fa;
    }

    .delete:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.3);
      color: #f87171;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 3rem;
      gap: 2rem;
    }

    .pagination button {
      background: rgba(36, 40, 72, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: #e4e6f1;
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1.2rem;
    }

    .pagination button:not(:disabled):hover {
      background: rgba(59, 130, 246, 0.2);
      border-color: rgba(59, 130, 246, 0.3);
      transform: translateY(-2px);
    }

    .pagination span {
      color: #9ca3af;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .no-data {
      text-align: center;
      padding: 4rem 0;
      color: #9ca3af;
      font-size: 1.2rem;
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

      .filters-row {
        flex-direction: column;
      }

      .search-container {
        min-width: auto;
      }

      .summary-cards {
        grid-template-columns: 1fr;
      }

      .date-range {
        flex-direction: column;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .add-transaction-btn {
        width: 100%;
        justify-content: center;
      }

      .welcome-card {
        padding: 2rem;
      }

      .page-header {
        padding: 1.5rem;
        margin-bottom: 2rem;
      }

      .page-header h1 {
        font-size: 2rem;
      }

      .summary-cards {
        gap: 1.5rem;
      }

      .card-icon {
        width: 60px;
        height: 60px;
      }

      .card-content .amount {
        font-size: 2rem;
      }
    }
  `]
})
export class TransactionListComponent implements OnInit {
  searchTerm: string = '';
  typeFilter: string = 'all';
  categoryFilter: string = 'all';
  periodFilter: string = 'this-month';
  startDate: string = '';
  endDate: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  sortColumn: string = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  transactions: Transaction[] = [];
  totalIncome: number = 0;
  totalExpenses: number = 0;
  balance: number = 0;
  
  Math = Math;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setDefaultDates();
    this.loadTransactions();
  }
  
  setDefaultDates(): void {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    this.startDate = this.formatDateForInput(firstDay);
    this.endDate = this.formatDateForInput(lastDay);
  }
  
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadTransactions(): void {
    this.transactions = [];
    this.calculateTotals();
    this.totalPages = 0;
  }
  
  calculateTotals(): void {
    this.totalIncome = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    this.totalExpenses = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    this.balance = this.totalIncome - this.totalExpenses;
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.applyFilters();
  }
  
  getCategoryIcon(category: string): string {
    switch (category) {
      case 'groceries': return 'fa-shopping-basket';
      case 'salary': return 'fa-money-check-alt';
      case 'entertainment': return 'fa-film';
      case 'transport': return 'fa-bus';
      case 'health': return 'fa-heartbeat';
      case 'utilities': return 'fa-bolt';
      default: return 'fa-tag';
    }
  }
  
  getCategoryName(category: string): string {
    switch (category) {
      case 'groceries': return 'Zakupy spożywcze';
      case 'salary': return 'Wynagrodzenie';
      case 'entertainment': return 'Rozrywka';
      case 'transport': return 'Transport';
      case 'health': return 'Zdrowie';
      case 'utilities': return 'Rachunki';
      default: return 'Inne';
    }
  }
  
  applyFilters(): void {
    this.currentPage = 1;
    this.setDatesByPeriod();
    this.loadTransactions();
  }
  
  setDatesByPeriod(): void {
    const now = new Date();
    let start = new Date();
    let end = new Date();
    
    switch (this.periodFilter) {
      case 'this-month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'last-month':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'last-3-months':
        start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'last-6-months':
        start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'this-year':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        break;
      case 'custom':
        return;
    }
    
    this.startDate = this.formatDateForInput(start);
    this.endDate = this.formatDateForInput(end);
  }
  
  goToPage(page: number): void {
    this.currentPage = page;
    this.loadTransactions();
  }
  
  editTransaction(id: number): void {
    console.log('Edytuj transakcję:', id);
  }
  
  deleteTransaction(id: number): void {
    console.log('Usuń transakcję:', id);
  }

  logout(): void {
    localStorage.removeItem('user_data');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 