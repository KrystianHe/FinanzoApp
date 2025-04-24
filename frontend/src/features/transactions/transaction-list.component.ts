import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="transaction-page">
      <div class="transaction-header">
        <h1>Transakcje</h1>
        <button class="add-transaction">
          <i class="fas fa-plus"></i> Dodaj transakcję
        </button>
      </div>

      <div class="filters-section">
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
        <div class="summary-card income">
          <div class="card-icon">
            <i class="fas fa-arrow-up"></i>
          </div>
          <div class="card-content">
            <h3>Suma przychodów</h3>
            <p class="amount">5200 zł</p>
          </div>
        </div>
        <div class="summary-card expenses">
          <div class="card-icon">
            <i class="fas fa-arrow-down"></i>
          </div>
          <div class="card-content">
            <h3>Suma wydatków</h3>
            <p class="amount">1619,58 zł</p>
          </div>
        </div>
        <div class="summary-card balance">
          <div class="card-icon">
            <i class="fas fa-wallet"></i>
          </div>
          <div class="card-content">
            <h3>Bilans</h3>
            <p class="amount">3580,42 zł</p>
          </div>
        </div>
      </div>

      <div class="transactions-table-container">
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
      </div>

      <div class="pagination">
        <button class="page-btn" [disabled]="currentPage === 1">
          <i class="fas fa-chevron-left"></i>
        </button>
        <span class="page-info">Strona {{ currentPage }} z {{ totalPages }}</span>
        <button class="page-btn" [disabled]="currentPage === totalPages">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .transaction-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      font-family: 'Roboto', sans-serif;
    }

    .transaction-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .transaction-header h1 {
      font-size: 2rem;
      color: #2c3e50;
      margin: 0;
    }

    .add-transaction {
      background: linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .add-transaction:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(78, 84, 200, 0.2);
    }

    .filters-section {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      margin-bottom: 2rem;
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
      position: relative;
      flex: 1;
      min-width: 250px;
    }

    .search-container i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #7f8c8d;
    }

    .search-container input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 2px solid #ecf0f1;
      border-radius: 8px;
      font-size: 1rem;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .filter-group label {
      font-size: 0.9rem;
      color: #7f8c8d;
      white-space: nowrap;
    }

    .filter-group select {
      padding: 0.75rem 1rem;
      border: 2px solid #ecf0f1;
      border-radius: 8px;
      font-size: 1rem;
      background-color: white;
      color: #2c3e50;
    }

    .date-range {
      display: flex;
      gap: 1rem;
    }

    .date-input {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .date-input label {
      font-size: 0.9rem;
      color: #7f8c8d;
    }

    .date-input input {
      padding: 0.75rem 1rem;
      border: 2px solid #ecf0f1;
      border-radius: 8px;
      font-size: 1rem;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .summary-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .summary-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
      font-size: 1.25rem;
      color: white;
    }

    .income .card-icon {
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
    }

    .expenses .card-icon {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    }

    .balance .card-icon {
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    }

    .card-content h3 {
      font-size: 1rem;
      color: #7f8c8d;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .amount {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2c3e50;
      margin: 0;
    }

    .transactions-table-container {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      margin-bottom: 2rem;
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
    }

    .transactions-table th {
      font-weight: 500;
      color: #7f8c8d;
      border-bottom: 2px solid #ecf0f1;
    }

    .th-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .th-content:hover {
      color: #3498db;
    }

    .transactions-table tbody tr {
      border-bottom: 1px solid #ecf0f1;
      transition: background-color 0.3s ease;
    }

    .transactions-table tbody tr:hover {
      background-color: #f8f9fa;
    }

    .category {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .category-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.9rem;
    }

    .grocery {
      background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
    }

    .salary {
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
    }

    .entertainment {
      background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
    }

    .transport {
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    }

    .utilities {
      background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
    }

    .amount.income {
      color: #2ecc71;
    }

    .amount.expense {
      color: #e74c3c;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      border: none;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .action-btn:hover {
      transform: translateY(-2px);
    }

    .edit {
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    }

    .delete {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .page-btn {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      border: 2px solid #ecf0f1;
      color: #2c3e50;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .page-btn:hover:not([disabled]) {
      border-color: #3498db;
      color: #3498db;
    }

    .page-btn[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      font-size: 0.9rem;
      color: #7f8c8d;
    }

    @media (max-width: 768px) {
      .filter-group, .search-container {
        width: 100%;
      }
      
      .actions {
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
  totalPages: number = 5;

  constructor() {}

  ngOnInit(): void {
    // Initialize with current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    this.startDate = this.formatDate(firstDay);
    this.endDate = this.formatDate(lastDay);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  sortBy(column: string): void {
    // Implementation for sorting
    console.log(`Sorting by ${column}`);
  }
} 