import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <div class="dashboard-summary">
        <div class="card">
          <h3>Saldo</h3>
          <p class="amount">5,240.00 zł</p>
        </div>
        <div class="card">
          <h3>Przychody</h3>
          <p class="amount positive">8,750.00 zł</p>
        </div>
        <div class="card">
          <h3>Wydatki</h3>
          <p class="amount negative">3,510.00 zł</p>
        </div>
      </div>
      <h2>Ostatnie transakcje</h2>
      <div class="card">
        <table class="transactions-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Opis</th>
              <th>Kategoria</th>
              <th>Kwota</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-05-03</td>
              <td>Zakupy spożywcze</td>
              <td>Jedzenie</td>
              <td class="negative">-120.50 zł</td>
            </tr>
            <tr>
              <td>2025-05-02</td>
              <td>Wypłata</td>
              <td>Pensja</td>
              <td class="positive">3,500.00 zł</td>
            </tr>
            <tr>
              <td>2025-05-01</td>
              <td>Czynsz</td>
              <td>Mieszkanie</td>
              <td class="negative">-1,200.00 zł</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      width: 100%;
    }
    
    .dashboard-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin: 1.5rem 0;
    }
    
    .amount {
      font-size: 1.8rem;
      font-weight: 500;
    }
    
    .positive {
      color: #28a745;
    }
    
    .negative {
      color: #dc3545;
    }
    
    .transactions-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .transactions-table th, .transactions-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e9ecef;
    }
    
    .transactions-table th {
      font-weight: 500;
      background-color: #f8f9fa;
    }
  `]
})
export class DashboardComponent {
} 