import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="budget-page">
      <div class="budget-header">
        <h1>Budżety</h1>
        <button class="add-budget-btn">
          <i class="fas fa-plus"></i> Dodaj budżet
        </button>
      </div>

      <div class="budget-filters">
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
        <div class="stat-card">
          <div class="stat-icon total">
            <i class="fas fa-money-bill-wave"></i>
          </div>
          <div class="stat-content">
            <h3>Całkowity budżet</h3>
            <p class="amount">1700 zł</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon spent">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="stat-content">
            <h3>Wydano</h3>
            <p class="amount">1020 zł</p>
          </div>
        </div>
        <div class="stat-card">
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
        <div class="budget-card">
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

        <div class="budget-card">
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

        <div class="budget-card">
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
    .budget-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      font-family: 'Roboto', sans-serif;
    }

    .budget-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .budget-header h1 {
      font-size: 2rem;
      color: #2c3e50;
      margin: 0;
    }

    .add-budget-btn {
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

    .add-budget-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(78, 84, 200, 0.2);
    }

    .budget-filters {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      margin-bottom: 2rem;
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
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

    .summary-stats {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
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

    .stat-icon.total {
      background: linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%);
    }

    .stat-icon.spent {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    }

    .stat-icon.remaining {
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
    }

    .stat-content h3 {
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

    .budget-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .budget-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      display: flex;
      justify-content: space-between;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .budget-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .budget-info {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      flex: 1;
    }

    .category-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: white;
      flex-shrink: 0;
    }

    .category-icon.grocery {
      background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
    }

    .category-icon.entertainment {
      background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
    }

    .category-icon.transport {
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    }

    .budget-details {
      flex: 1;
    }

    .budget-details h3 {
      font-size: 1.25rem;
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
    }

    .date-range {
      font-size: 0.9rem;
      color: #7f8c8d;
      margin-bottom: 1rem;
    }

    .progress-section {
      width: 100%;
    }

    .progress-bar {
      height: 10px;
      background-color: #ecf0f1;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress {
      height: 100%;
      background: linear-gradient(90deg, #3498db 0%, #2980b9 100%);
      border-radius: 5px;
    }

    .progress.warning {
      background: linear-gradient(90deg, #f39c12 0%, #e67e22 100%);
    }

    .progress.danger {
      background: linear-gradient(90deg, #e74c3c 0%, #c0392b 100%);
    }

    .progress-stats {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: #7f8c8d;
    }

    .budget-actions {
      display: flex;
      gap: 0.5rem;
      align-items: flex-start;
    }

    .action-btn {
      width: 40px;
      height: 40px;
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

    @media (max-width: 768px) {
      .budget-card {
        flex-direction: column;
      }
      
      .budget-actions {
        margin-top: 1rem;
        align-self: flex-end;
      }
    }
  `]
})
export class BudgetListComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
} 