import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="transactions-container">
      <h1>Transakcje</h1>
      <div class="actions-bar">
        <button class="btn btn-primary">Dodaj transakcję</button>
        <div class="filter-controls">
          <input type="text" placeholder="Szukaj..." class="search-input">
          <select class="filter-select">
            <option value="">Wszystkie kategorie</option>
            <option value="jedzenie">Jedzenie</option>
            <option value="transport">Transport</option>
            <option value="mieszkanie">Mieszkanie</option>
            <option value="rozrywka">Rozrywka</option>
            <option value="pensja">Pensja</option>
          </select>
        </div>
      </div>
      <div class="card">
        <table class="transactions-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Opis</th>
              <th>Kategoria</th>
              <th>Kwota</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-05-03</td>
              <td>Zakupy spożywcze</td>
              <td>Jedzenie</td>
              <td class="negative">-120.50 zł</td>
              <td>
                <button class="btn-icon">✏️</button>
                <button class="btn-icon">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>2025-05-02</td>
              <td>Wypłata</td>
              <td>Pensja</td>
              <td class="positive">3,500.00 zł</td>
              <td>
                <button class="btn-icon">✏️</button>
                <button class="btn-icon">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>2025-05-01</td>
              <td>Czynsz</td>
              <td>Mieszkanie</td>
              <td class="negative">-1,200.00 zł</td>
              <td>
                <button class="btn-icon">✏️</button>
                <button class="btn-icon">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .transactions-container {
      width: 100%;
    }
    
    .actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1rem 0;
    }
    
    .filter-controls {
      display: flex;
      gap: 1rem;
    }
    
    .search-input, .filter-select {
      padding: 0.5rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
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
    
    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      margin-right: 0.5rem;
    }
  `]
})
export class TransactionsComponent {
} 