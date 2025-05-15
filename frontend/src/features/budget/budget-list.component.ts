import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
          <select>
            <option value="all">Wszystkie</option>
            <option value="active">Aktywne</option>
            <option value="completed">Zakończone</option>
            <option value="upcoming">Nadchodzące</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Kategoria:</label>
          <select>
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
            <p class="amount">1700 zł</p>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon spent">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="stat-content">
            <h3>Wydano</h3>
            <p class="amount">1020 zł</p>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon remaining">
            <i class="fas fa-piggy-bank"></i>
          </div>
          <div class="stat-content">
            <h3>Pozostało</h3>
            <p class="amount">680 zł</p>
          </div>
        </div>
      </div>

      <div class="budget-list">
        <div class="card budget-card">
          <div class="budget-info">
            <div class="category-icon grocery">
              <i class="fas fa-shopping-basket"></i>
            </div>
            <div class="budget-details">
              <h3>Zakupy spożywcze</h3>
              <p class="date-range">1-31 maja 2024</p>
              <div class="progress-section">
                <div class="progress-bar">
                  <div class="progress" style="width: 45%"></div>
                </div>
                <div class="progress-stats">
                  <span class="progress-text">450 zł / 1000 zł</span>
                  <span class="percentage">45%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="budget-actions">
            <button class="action-btn edit">
              <i class="fas fa-pencil-alt"></i>
            </button>
            <button class="action-btn delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <div class="card budget-card">
          <div class="budget-info">
            <div class="category-icon entertainment">
              <i class="fas fa-film"></i>
            </div>
            <div class="budget-details">
              <h3>Rozrywka</h3>
              <p class="date-range">1-31 maja 2024</p>
              <div class="progress-section">
                <div class="progress-bar">
                  <div class="progress warning" style="width: 75%"></div>
                </div>
                <div class="progress-stats">
                  <span class="progress-text">300 zł / 400 zł</span>
                  <span class="percentage">75%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="budget-actions">
            <button class="action-btn edit">
              <i class="fas fa-pencil-alt"></i>
            </button>
            <button class="action-btn delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <div class="card budget-card">
          <div class="budget-info">
            <div class="category-icon transport">
              <i class="fas fa-bus"></i>
            </div>
            <div class="budget-details">
              <h3>Transport</h3>
              <p class="date-range">1-31 maja 2024</p>
              <div class="progress-section">
                <div class="progress-bar">
                  <div class="progress danger" style="width: 90%"></div>
                </div>
                <div class="progress-stats">
                  <span class="progress-text">270 zł / 300 zł</span>
                  <span class="percentage">90%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="budget-actions">
            <button class="action-btn edit">
              <i class="fas fa-pencil-alt"></i>
            </button>
            <button class="action-btn delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
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

    .grocery {
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
  constructor() {}

  ngOnInit(): void {}
} 