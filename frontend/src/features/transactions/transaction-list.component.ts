import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule],
  template: `
    <div class="transaction-container">
      <div class="transaction-header">
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
            <select [(ngModel)]="typeFilter" (change)="applyFilters()">
              <option value="all">Wszystkie</option>
              <option value="income">Przychody</option>
              <option value="expense">Wydatki</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Kategoria:</label>
            <select [(ngModel)]="categoryFilter" (change)="applyFilters()">
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
            <select [(ngModel)]="periodFilter" (change)="applyFilters()">
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
              <input type="date" [(ngModel)]="startDate" (change)="applyFilters()">
            </div>
            <div class="date-input">
              <label>Do:</label>
              <input type="date" [(ngModel)]="endDate" (change)="applyFilters()">
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
            
            <!-- Komunikat o braku transakcji -->
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
  `,
  styles: [`
    .transaction-container {
      padding: 1rem;
    }

    .transaction-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    h1 {
      color: #e4e6f1;
      margin: 0;
      font-size: 1.8rem;
      font-weight: 600;
    }

    .add-transaction-btn {
      background: linear-gradient(135deg, #3b82f6, #60a5fa);
      color: white;
      border: none;
      border-radius: 0.5rem;
      padding: 0.8rem 1.2rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .add-transaction-btn:hover {
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      transform: translateY(-2px);
    }

    .card {
      background-color: #1A1C36;
      border-radius: 0.8rem;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      margin-bottom: 1.5rem;
    }

    .filters-section {
      padding: 1.2rem;
    }

    .filters-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .filters-row:last-child {
      margin-bottom: 0;
    }

    .search-container {
      display: flex;
      align-items: center;
      background-color: #242848;
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      flex: 1;
      min-width: 200px;
    }

    .search-container i {
      color: #9ca3af;
      margin-right: 0.5rem;
    }

    .search-container input {
      background: none;
      border: none;
      color: #e4e6f1;
      width: 100%;
      outline: none;
      font-size: 0.9rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      min-width: 150px;
    }

    .filter-group label {
      margin-bottom: 0.3rem;
      font-size: 0.85rem;
      color: #9ca3af;
    }

    .filter-group select {
      padding: 0.8rem;
      border-radius: 0.5rem;
      border: 1px solid #374151;
      background-color: #242848;
      color: #e4e6f1;
      font-size: 0.9rem;
    }

    .date-range {
      display: flex;
      gap: 1rem;
      flex: 1;
    }

    .date-input {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .date-input label {
      margin-bottom: 0.3rem;
      font-size: 0.85rem;
      color: #9ca3af;
    }

    .date-input input {
      padding: 0.8rem;
      border-radius: 0.5rem;
      border: 1px solid #374151;
      background-color: #242848;
      color: #e4e6f1;
      font-size: 0.9rem;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .summary-card {
      display: flex;
      align-items: center;
      padding: 1.5rem;
    }

    .card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      font-size: 1.2rem;
      margin-right: 1rem;
    }

    .income .card-icon {
      background-color: rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }

    .expenses .card-icon {
      background-color: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .balance .card-icon {
      background-color: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
    }

    .card-content h3 {
      margin: 0 0 0.3rem;
      font-size: 0.9rem;
      color: #9ca3af;
    }

    .card-content .amount {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #e4e6f1;
    }

    .transactions-table-container {
      padding: 1.5rem;
      overflow-x: auto;
    }

    .transactions-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 600px;
    }

    .transactions-table th {
      padding: 1rem;
      text-align: left;
      color: #9ca3af;
      font-weight: 500;
      border-bottom: 1px solid #242848;
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
      margin-left: 0.5rem;
      font-size: 0.8rem;
    }

    .transactions-table td {
      padding: 1rem;
      border-bottom: 1px solid #242848;
      color: #e4e6f1;
      font-size: 0.95rem;
    }

    .category {
      display: flex;
      align-items: center;
    }

    .category-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 0.8rem;
      font-size: 1rem;
    }

    .groceries {
      background-color: rgba(249, 115, 22, 0.2);
      color: #f97316;
    }

    .salary {
      background-color: rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }

    .entertainment {
      background-color: rgba(168, 85, 247, 0.2);
      color: #a855f7;
    }

    .transport {
      background-color: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
    }

    .health {
      background-color: rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }

    .utilities {
      background-color: rgba(234, 88, 12, 0.2);
      color: #ea580c;
    }

    .other {
      background-color: rgba(107, 114, 128, 0.2);
      color: #6b7280;
    }

    .amount {
      font-weight: 600;
    }

    .income {
      color: #22c55e;
    }

    .expense {
      color: #ef4444;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      background: none;
      border: none;
      cursor: pointer;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .edit {
      color: #3b82f6;
    }

    .delete {
      color: #ef4444;
    }

    .action-btn:hover {
      background-color: #242848;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1.5rem;
      gap: 1rem;
    }

    .pagination button {
      background-color: #242848;
      border: none;
      border-radius: 50%;
      color: #e4e6f1;
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pagination button:disabled {
      background-color: #1e1f2f;
      color: #6b7280;
      cursor: not-allowed;
    }

    .pagination button:not(:disabled):hover {
      background-color: #2f3356;
    }

    .pagination span {
      color: #9ca3af;
      font-size: 0.9rem;
    }

    .no-data {
      text-align: center;
      padding: 2rem 0;
      color: #9ca3af;
    }

    @media (max-width: 768px) {
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
  
  // Dostęp do obiektu Math w template
  Math = Math;

  constructor() {}

  ngOnInit(): void {
    // Inicjalizacja dat dla filtra "Ten miesiąc"
    this.setDefaultDates();
    
    // Pobieranie transakcji
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
    // Tutaj będzie kod do pobrania transakcji z serwera
    // Na przykład: this.transactionService.getTransactions(this.filters).subscribe(data => { this.transactions = data; this.calculateTotals(); });
    
    // Na razie pozostawiamy pustą tablicę
    this.transactions = [];
    this.calculateTotals();
    
    // Ustaw liczbę stron na 0, jeśli brak transakcji
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
      // Zmień kierunek sortowania, jeśli kliknięto tę samą kolumnę
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Ustaw nową kolumnę sortowania
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    // Wywołaj filtrowanie, aby ponownie pobrać dane z sortowaniem
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
    // Ustaw stronę na pierwszą przy zmianie filtrów
    this.currentPage = 1;
    
    // Ustaw daty na podstawie wybranego okresu
    this.setDatesByPeriod();
    
    // Pobierz transakcje z zastosowanymi filtrami
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
        // Pozostaw daty wprowadzone przez użytkownika
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
    // Tutaj będzie logika edycji transakcji
  }
  
  deleteTransaction(id: number): void {
    console.log('Usuń transakcję:', id);
    // Tutaj będzie logika usuwania transakcji
  }
} 