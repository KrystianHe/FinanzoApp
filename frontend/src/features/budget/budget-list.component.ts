import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Budget {
  id: number;
  name: string;
  category: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  spent: number;
  categoryIcon?: string;
}

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="budget-container">
      <div class="budget-header">
        <h1>Budżety</h1>
        <button class="add-budget-btn">
          <i class="fas fa-plus"></i> Dodaj budżet
        </button>
      </div>

      <div class="card budget-filters">
        <div class="filter-group">
          <label>Status:</label>
          <select (change)="applyFilters()">
            <option value="all">Wszystkie</option>
            <option value="active">Aktywne</option>
            <option value="completed">Zakończone</option>
            <option value="upcoming">Nadchodzące</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Kategoria:</label>
          <select (change)="applyFilters()">
            <option value="all">Wszystkie</option>
            <option value="groceries">Zakupy spożywcze</option>
            <option value="entertainment">Rozrywka</option>
            <option value="transport">Transport</option>
            <option value="health">Zdrowie</option>
            <option value="utilities">Rachunki</option>
            <option value="other">Inne</option>
          </select>
        </div>
      </div>

      <div class="summary-stats">
        <div class="card stat-card">
          <div class="stat-icon total">
            <i class="fas fa-money-bill-wave"></i>
          </div>
          <div class="stat-content">
            <h3>Całkowity budżet</h3>
            <p class="amount">{{ totalBudget }} zł</p>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon spent">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="stat-content">
            <h3>Wydano</h3>
            <p class="amount">{{ totalSpent }} zł</p>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon remaining">
            <i class="fas fa-piggy-bank"></i>
          </div>
          <div class="stat-content">
            <h3>Pozostało</h3>
            <p class="amount">{{ totalRemaining }} zł</p>
          </div>
        </div>
      </div>

      <div class="budget-list">
        <!-- Budżety pobrane z bazy danych -->
        <div class="card budget-card" *ngFor="let budget of budgets">
          <div class="budget-info">
            <div class="category-icon" [ngClass]="budget.category">
              <i class="fas" [ngClass]="getCategoryIcon(budget.category)"></i>
            </div>
            <div class="budget-details">
              <h3>{{ budget.name }}</h3>
              <p class="date-range">{{ formatDateRange(budget.startDate, budget.endDate) }}</p>
              <div class="progress-section">
                <div class="progress-bar">
                  <div class="progress" 
                       [ngClass]="getProgressClass(budget.spent, budget.amount)"
                       [style.width.%]="getProgressPercentage(budget.spent, budget.amount)"></div>
                </div>
                <div class="progress-stats">
                  <span class="progress-text">{{ budget.spent }} zł / {{ budget.amount }} zł</span>
                  <span class="percentage">{{ getProgressPercentage(budget.spent, budget.amount) }}%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="budget-actions">
            <button class="action-btn edit" (click)="editBudget(budget.id)">
              <i class="fas fa-pencil-alt"></i>
            </button>
            <button class="action-btn delete" (click)="deleteBudget(budget.id)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <!-- Stan pustej listy budżetów -->
        <div class="empty-state" *ngIf="budgets.length === 0">
          <p>Nie masz jeszcze żadnych budżetów. Kliknij "Dodaj budżet" aby utworzyć pierwszy budżet.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .budget-container {
      padding: 1rem;
    }

    .budget-header {
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

    .add-budget-btn {
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

    .add-budget-btn:hover {
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

    .budget-filters {
      display: flex;
      gap: 1.5rem;
      padding: 1.2rem;
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

    .summary-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      padding: 1.5rem;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      font-size: 1.2rem;
      margin-right: 1rem;
    }

    .total {
      background-color: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
    }

    .spent {
      background-color: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .remaining {
      background-color: rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }

    .stat-content h3 {
      margin: 0 0 0.3rem;
      font-size: 0.9rem;
      color: #9ca3af;
    }

    .stat-content .amount {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #e4e6f1;
    }

    .budget-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 2rem;
      color: #9ca3af;
      background-color: #1A1C36;
      border-radius: 0.8rem;
    }

    .budget-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
    }

    .budget-info {
      display: flex;
      margin-bottom: 1rem;
    }

    .category-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 1rem;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .groceries {
      background-color: rgba(249, 115, 22, 0.2);
      color: #f97316;
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

    .budget-details {
      flex: 1;
    }

    .budget-details h3 {
      margin: 0 0 0.2rem;
      font-size: 1.1rem;
      color: #e4e6f1;
    }

    .date-range {
      font-size: 0.85rem;
      color: #9ca3af;
      margin: 0 0 1rem;
    }

    .progress-section {
      margin-top: 0.5rem;
    }

    .progress-bar {
      height: 8px;
      background-color: #242848;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #60a5fa);
      border-radius: 4px;
    }

    .progress.warning {
      background: linear-gradient(90deg, #f59e0b, #fbbf24);
    }

    .progress.danger {
      background: linear-gradient(90deg, #ef4444, #f87171);
    }

    .progress-stats {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
    }

    .progress-text {
      color: #9ca3af;
    }

    .percentage {
      font-weight: 600;
      color: #e4e6f1;
    }

    .budget-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: auto;
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

    @media (max-width: 768px) {
      .budget-filters {
        flex-direction: column;
      }

      .summary-stats {
        grid-template-columns: 1fr;
      }

      .budget-list {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BudgetListComponent implements OnInit {
  budgets: Budget[] = [];
  totalBudget: number = 0;
  totalSpent: number = 0;
  totalRemaining: number = 0;

  constructor() {}

  ngOnInit(): void {
    // Tutaj będzie wywołanie serwisu do pobrania budżetów z backendu
    this.loadBudgets();
  }

  loadBudgets(): void {
    // Tutaj będzie kod do pobrania budżetów z serwera
    // Przykład: this.budgetService.getBudgets().subscribe(data => { this.budgets = data; this.calculateTotals(); });
    
    // Na razie pozostawiamy pustą tablicę
    this.budgets = [];
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.totalBudget = this.budgets.reduce((sum, budget) => sum + budget.amount, 0);
    this.totalSpent = this.budgets.reduce((sum, budget) => sum + budget.spent, 0);
    this.totalRemaining = this.totalBudget - this.totalSpent;
  }

  getProgressPercentage(spent: number, total: number): number {
    if (total === 0) return 0;
    const percentage = Math.round((spent / total) * 100);
    return Math.min(percentage, 100); // Nie pozwalamy na wartości powyżej 100%
  }

  getProgressClass(spent: number, total: number): string {
    const percentage = this.getProgressPercentage(spent, total);
    if (percentage >= 90) return 'danger';
    if (percentage >= 70) return 'warning';
    return '';
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'groceries': return 'fa-shopping-basket';
      case 'entertainment': return 'fa-film';
      case 'transport': return 'fa-bus';
      case 'health': return 'fa-heartbeat';
      case 'utilities': return 'fa-bolt';
      default: return 'fa-tag';
    }
  }

  formatDateRange(startDate: Date, endDate: Date): string {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = start.getMonth() + 1;
    const endMonth = end.getMonth() + 1;
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();
    
    // Formatowanie w stylu "1-31 maja 2024" lub "1 stycznia - 28 lutego 2024"
    const monthNames = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 
                         'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
    
    if (startMonth === endMonth && startYear === endYear) {
      return `${startDay}-${endDay} ${monthNames[startMonth-1]} ${startYear}`;
    } else {
      return `${startDay} ${monthNames[startMonth-1]} - ${endDay} ${monthNames[endMonth-1]} ${endYear}`;
    }
  }

  applyFilters(): void {
    // Tutaj będzie logika filtrowania budżetów
    this.loadBudgets();
  }

  editBudget(id: number): void {
    // Tutaj będzie logika edycji budżetu
    console.log('Edytuj budżet:', id);
  }

  deleteBudget(id: number): void {
    // Tutaj będzie logika usuwania budżetu
    console.log('Usuń budżet:', id);
  }
} 