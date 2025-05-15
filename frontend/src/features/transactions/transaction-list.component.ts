import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
            <input type="text" placeholder="Szukaj transakcji..." [(ngModel)]="searchTerm">
          </div>
          <div class="filter-group">
            <label>Typ:</label>
            <select [(ngModel)]="typeFilter">
              <option value="all">Wszystkie</option>
              <option value="income">Przychody</option>
              <option value="expense">Wydatki</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Kategoria:</label>
            <select [(ngModel)]="categoryFilter">
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
            <select [(ngModel)]="periodFilter">
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
              <input type="date" [(ngModel)]="startDate">
            </div>
            <div class="date-input">
              <label>Do:</label>
              <input type="date" [(ngModel)]="endDate">
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
            <p class="amount">5200 zł</p>
          </div>
        </div>
        <div class="card summary-card expenses">
          <div class="card-icon">
            <i class="fas fa-arrow-down"></i>
          </div>
          <div class="card-content">
            <h3>Suma wydatków</h3>
            <p class="amount">1619,58 zł</p>
          </div>
        </div>
        <div class="card summary-card balance">
          <div class="card-icon">
            <i class="fas fa-wallet"></i>
          </div>
          <div class="card-content">
            <h3>Bilans</h3>
            <p class="amount">3580,42 zł</p>
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
            <tr>
              <td>20.05.2024</td>
              <td>
                <div class="category">
                  <span class="category-icon grocery">
                    <i class="fas fa-shopping-basket"></i>
                  </span>
                  <span>Zakupy spożywcze</span>
                </div>
              </td>
              <td>Biedronka</td>
              <td class="amount expense">-125,45 zł</td>
              <td class="actions">
                <button class="action-btn edit">
                  <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="action-btn delete">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>15.05.2024</td>
              <td>
                <div class="category">
                  <span class="category-icon salary">
                    <i class="fas fa-money-check-alt"></i>
                  </span>
                  <span>Wynagrodzenie</span>
                </div>
              </td>
              <td>Pensja za kwiecień</td>
              <td class="amount income">+3500,00 zł</td>
              <td class="actions">
                <button class="action-btn edit">
                  <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="action-btn delete">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>12.05.2024</td>
              <td>
                <div class="category">
                  <span class="category-icon entertainment">
                    <i class="fas fa-film"></i>
                  </span>
                  <span>Rozrywka</span>
                </div>
              </td>
              <td>Kino Cinema City</td>
              <td class="amount expense">-48,90 zł</td>
              <td class="actions">
                <button class="action-btn edit">
                  <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="action-btn delete">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>10.05.2024</td>
              <td>
                <div class="category">
                  <span class="category-icon transport">
                    <i class="fas fa-bus"></i>
                  </span>
                  <span>Transport</span>
                </div>
              </td>
              <td>Bilet miesięczny</td>
              <td class="amount expense">-120,00 zł</td>
              <td class="actions">
                <button class="action-btn edit">
                  <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="action-btn delete">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>05.05.2024</td>
              <td>
                <div class="category">
                  <span class="category-icon utilities">
                    <i class="fas fa-bolt"></i>
                  </span>
                  <span>Rachunki</span>
                </div>
              </td>
              <td>Prąd</td>
              <td class="amount expense">-175,23 zł</td>
              <td class="actions">
                <button class="action-btn edit">
                  <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="action-btn delete">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="pagination">
          <button [disabled]="currentPage === 1" (click)="currentPage = currentPage - 1">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span>Strona {{ currentPage }} z {{ totalPages }}</span>
          <button [disabled]="currentPage === totalPages" (click)="currentPage = currentPage + 1">
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

    .search-container {
      position: relative;
      flex: 1;
      min-width: 200px;
    }

    .search-container i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
    }

    .search-container input {
      width: 100%;
      padding: 0.8rem 1rem 0.8rem 2.5rem;
      border-radius: 0.5rem;
      border: 1px solid #374151;
      background-color: #242848;
      color: #e4e6f1;
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
      width: 100%;
    }

    .date-input {
      display: flex;
      flex-direction: column;
      flex: 1;
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
      overflow-x: auto;
    }

    .transactions-table {
      width: 100%;
      border-collapse: collapse;
    }

    .transactions-table th, 
    .transactions-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #2d3748;
    }

    .transactions-table thead {
      background-color: #242848;
    }

    .transactions-table th {
      color: #9ca3af;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .th-content {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .th-content i {
      margin-left: 0.5rem;
      font-size: 0.8rem;
    }

    .th-content:hover {
      color: #3b82f6;
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

    .grocery {
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

    .amount {
      font-weight: 600;
    }

    .amount.income {
      color: #22c55e;
    }

    .amount.expense {
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
      padding: 1rem;
      gap: 1rem;
    }

    .pagination button {
      background: none;
      border: none;
      color: #3b82f6;
      cursor: pointer;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .pagination button:hover:not([disabled]) {
      background-color: #242848;
    }

    .pagination button[disabled] {
      color: #6b7280;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .filters-row {
        flex-direction: column;
      }
      
      .search-container {
        width: 100%;
      }
      
      .summary-cards {
        grid-template-columns: 1fr;
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
  totalPages: number = 5;

  constructor() {}

  ngOnInit(): void {
    const now = new Date();
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(now.getMonth() - 1);
    
    this.startDate = this.formatDate(lastMonthDate);
    this.endDate = this.formatDate(now);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  sortBy(column: string): void {
    console.log(`Sorting by ${column}`);
  }
} 