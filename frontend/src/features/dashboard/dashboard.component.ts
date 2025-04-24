import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-wallet"></i>
          </div>
          <div class="stat-content">
            <h3>Saldo</h3>
            <p class="stat-value">2,500.00 zł</p>
            <p class="stat-change positive">+15% w tym miesiącu</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="stat-content">
            <h3>Wydatki</h3>
            <p class="stat-value">1,230.50 zł</p>
            <p class="stat-change negative">-8% w porównaniu z poprzednim miesiącem</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-piggy-bank"></i>
          </div>
          <div class="stat-content">
            <h3>Oszczędności</h3>
            <p class="stat-value">5,400.00 zł</p>
            <p class="stat-change positive">Cel: 10,000 zł</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-bullseye"></i>
          </div>
          <div class="stat-content">
            <h3>Cele finansowe</h3>
            <p class="stat-value">2/4</p>
            <p class="stat-change">Ukończone cele</p>
          </div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-card">
          <h3>Wydatki według kategorii</h3>
          <div class="category-list">
            <div class="category-item">
              <div class="category-info">
                <span class="category-name">Jedzenie</span>
                <span class="category-amount">450.00 zł</span>
              </div>
              <div class="progress-bar">
                <div class="progress" style="width: 45%"></div>
              </div>
            </div>
            <div class="category-item">
              <div class="category-info">
                <span class="category-name">Transport</span>
                <span class="category-amount">320.00 zł</span>
              </div>
              <div class="progress-bar">
                <div class="progress" style="width: 32%"></div>
              </div>
            </div>
            <div class="category-item">
              <div class="category-info">
                <span class="category-name">Rozrywka</span>
                <span class="category-amount">250.00 zł</span>
              </div>
              <div class="progress-bar">
                <div class="progress" style="width: 25%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3>Ostatnie transakcje</h3>
          <div class="transactions-list">
            <div class="transaction-item">
              <div class="transaction-icon food">
                <i class="fas fa-utensils"></i>
              </div>
              <div class="transaction-details">
                <span class="transaction-name">Zakupy spożywcze</span>
                <span class="transaction-date">Dzisiaj</span>
              </div>
              <span class="transaction-amount negative">-120.50 zł</span>
            </div>
            <div class="transaction-item">
              <div class="transaction-icon transport">
                <i class="fas fa-bus"></i>
              </div>
              <div class="transaction-details">
                <span class="transaction-name">Bilet miesięczny</span>
                <span class="transaction-date">Wczoraj</span>
              </div>
              <span class="transaction-amount negative">-156.00 zł</span>
            </div>
            <div class="transaction-item">
              <div class="transaction-icon income">
                <i class="fas fa-money-bill-wave"></i>
              </div>
              <div class="transaction-details">
                <span class="transaction-name">Wynagrodzenie</span>
                <span class="transaction-date">2 dni temu</span>
              </div>
              <span class="transaction-amount positive">+3,500.00 zł</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      background-color: #f8fafc;
      min-height: calc(100vh - 60px);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
      color: white;
      font-size: 1.5rem;
    }

    .stat-content {
      flex: 1;

      h3 {
        color: #64748b;
        font-size: 0.875rem;
        margin: 0 0 0.5rem 0;
      }

      .stat-value {
        color: #1e293b;
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 0.25rem 0;
      }

      .stat-change {
        font-size: 0.875rem;
        margin: 0;

        &.positive {
          color: #10b981;
        }

        &.negative {
          color: #ef4444;
        }
      }
    }

    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .chart-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

      h3 {
        color: #1e293b;
        margin: 0 0 1.5rem 0;
        font-size: 1.125rem;
      }
    }

    .category-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .category-item {
      .category-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }

      .category-name {
        color: #64748b;
      }

      .category-amount {
        color: #1e293b;
        font-weight: 500;
      }
    }

    .progress-bar {
      height: 8px;
      background-color: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;

      .progress {
        height: 100%;
        background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
        border-radius: 4px;
      }
    }

    .transactions-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .transaction-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      border-radius: 8px;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #f1f5f9;
      }
    }

    .transaction-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;

      &.food {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      }

      &.transport {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      }

      &.income {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      }
    }

    .transaction-details {
      flex: 1;
      display: flex;
      flex-direction: column;

      .transaction-name {
        color: #1e293b;
        font-weight: 500;
      }

      .transaction-date {
        color: #64748b;
        font-size: 0.875rem;
      }
    }

    .transaction-amount {
      font-weight: 600;

      &.positive {
        color: #10b981;
      }

      &.negative {
        color: #ef4444;
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .charts-section {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
} 